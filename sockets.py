from gevent import monkey;

monkey.patch_all()
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_from_directory
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
from flask.ext.sqlalchemy import SQLAlchemy
from chess import app
import re
from datetime import datetime
import database
import hashlib
# The socket.io namespace
rooms = []


class Room(BaseNamespace, RoomsMixin, BroadcastMixin):
    def on_move(self, data):
        self.emit_to_room('main_room', 'move enemy', data)
        print "ALA AKBHAR"

    def on_sendMessageGameroom(self, data):

        self.emit_to_room(data['hash'], 'gameMessage', data)

    def on_turnOver(self, data):
        print "boe"
        print data
        turn = ""
        if data['turn'] == 'white':
            turn = 'white'
            self.emit_to_room(self.socket.session['room'], 'getTurn', turn)
        else:
            turn = 'black'
            self.emit_to_room(self.socket.session['room'], 'getTurn', turn)
        updateTurn(data['hash'], turn)

    def on_gameOver(self,data):
        updatePlayerScore(playersInRoom(self.socket.session['room'], 'banan', True),data)
        self.emit_to_room(self.socket.session['room'], 'gameFinished',data)
        self.emit('gameFinished',data)


    def on_movePiece(self, data):
        self.emit_to_room(self.socket.session['room'], 'moveEnemy', data)

    def on_promotePiece(self, data):
        self.emit_to_room(self.socket.session['room'], 'promotePiece', data)

    def on_updateBoard(self, data):
        updateBoard(data['hash'], data['board'])
        self.emit_to_room(self.socket.session['room'], 'redrawBoard', data)


    def on_strikePiece(self, data):
        self.emit_to_room(self.socket.session['room'], 'strikeEnemy', data)

    def on_getTeam(self, data):
        print data
        self.socket.session['room'] = data['hash']
        self.join(data['hash'])
        print "spelers - " + str(playersInRoom(data['hash'], data['name'], False))
        self.emit("playersInRoom", playersInRoom(data['hash'], data['name'], True))
        if playersInRoom(data['hash'], data['name'], False) == 1:
            team = 'white'
            self.emit('receiveTeam', {'team': team,
                                      'board': returnBoard(data['hash']),
                                      'turn': returnTurn(data['hash'])}
            )
        elif playersInRoom(data['hash'], data['name'], False) == 2:
            team = 'black'
            self.emit('receiveTeam', {'team': team,
                                      'board': returnBoard(data['hash']),
                                      'turn': returnTurn(data['hash'])})


    def on_enterLobby(self, data):
        addRooms()
        self.socket.session['nickname'] = data
        print "test"
        print self.socket.session['nickname']
        m = datetime.now().minute
        h = datetime.now().hour
        message = {
            'rank': 'bK',
            'name': "ALL MIGHTY SEVER",
            'time': str(h) + ":" + str(m),
            'message': '%s has connected' % self.socket.session['nickname']
        }
        self.broadcast_event('message', message)
        # Just have them join a default-named room
        self.join('lobby')

        self.emit('nickname', {
            'name':  self.socket.session['nickname'],
            'rank':  getUserRank(self.socket.session['nickname']),
            'wins':  getUserStats(self.socket.session['nickname'])['wins'],
            'loses': getUserStats(self.socket.session['nickname'])['loses']
        })
        self.broadcast_event('lobbyCreated', rooms)
        print "connected"

    def on_create(self, data):
        print data['roomName']
        createRoom(self.socket.session['nickname'], data['roomName'])

        self.room = {
            'creatorRank': getUserRank(self.socket.session['nickname']),
            'creator': self.socket.session['nickname'],
            'name': data['roomName'],
            'players': 1,
            'inPlay': False,
            'hash': getRoomHashByUser(self.socket.session['nickname'])

        }
        print rooms
        rooms.append(self.room)
        self.broadcast_event('lobbyCreated', rooms)

    def on_joinGame(self, data):
        print "game Joined"
        self.join(data['hash'])
        addPlayerToRoom(data['name'], data['hash'])

    def on_sendMessage(self, msg):
        print "boe"
        self.broadcast_event('message', msg)

    def recv_message(self, message):
        print "PING!!!", message

    def on_verify(self, data):
        if data.has_key('value'):
            print data['value']
            print "validating"
            print checkUser(data['name'], data['value'], database.User, )
            self.emit('validation',
                      {'name': data['name'], 'answer': checkUser(data['name'], data['value'], database.User, )})

    def recv_disconnect(self):
        # Remove nickname from the list
        if 'nickname' in self.socket.session:
            nickname = self.socket.session['nickname']
            m = datetime.now().minute
            h = datetime.now().hour
            for item in rooms:
                if item['creator'] == nickname:
                    rooms.remove(item)
            message = {
                'rank': 'bK',
                'name': "ALL MIGHTY SEVER",
                'time': str(h) + ":" + str(m),
                'message': '%s has disconnected' % nickname
            }
            self.broadcast_event('message', message)
            self.disconnect(silent=True)
            self.broadcast_event('lobbyCreated', rooms)
        return True


def checkUser(type, value, table):
    result = ''
    if not value:
        return True
    result = table.query.all()
    if type == 'username':
        for u in result:
            if u.username.lower() == value.lower():
                return True
        else:
            return False
    elif type == 'email':
        if re.match(r'^[_\.0-9a-zA-Z-+]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$', value):
            for u in result:
                if u.email.lower() == value.lower():
                    return True
            else:
                return False
        else:
            return 'invalid'


def getUserRank(user):
    result = database.User.query.all()
    avatar = ''
    for u in result:
        if u.username.lower() == user:
            avatar = u.color + u.rank.title()
    return avatar


def createRoom(creator, name):
    hasher = hashlib.md5()
    hasher.update(creator)
    result = database.User.query.all()
    for u in result:
        if u.username.lower() == creator.lower():
            print name.lower()
            room = database.Room(u.id, name, creator.lower(), str(hasher.hexdigest()), '')
            database.db.session.add(room)
            database.db.session.commit()


def deleteRoom(id):
    result = database.Room.query.all()
    for u in result:
        if u.id == id.lower():
            players = database.User.query.all()
            for player in players:
                if not notInArray(u.players.split(','), player.username):
                    database.User.query.filter_by(username=player.username).update(
                        dict(str(removeArrayItem(player.joinedRooms.split(','), u.roomHash))))
                    database.db.session.commit()
        database.Room.query.filter_by(id=id).first().delete()
        database.db.session.commit()


def playersInRoom(hash, name, names):
    result = database.Room.query.all()
    if not names:
        for item in result:
            if (item.roomHash == hash):
                amountPlayers = item.players.split(',')
                if len(amountPlayers) == 2:
                    for players in amountPlayers:
                        if players.lower() == name.lower():
                            return amountPlayers.index(players) + 1
                else:
                    return 1
    else:
        for item in result:
            if (item.roomHash == hash):
                return item.players


def getRoomHashByUser(name):
    users = database.User.query.all()
    userId = None
    for user in users:
        if user.username.lower() == name.lower():
            userId = user.id
            break
    rooms = database.Room.query.all()
    for room in rooms:
        if room.creator == userId:
            return room.roomHash
            break
    else:
        return "no room"


def getRoomName(hash):
    result = database.Room.query.all()
    for item in result:
        if (item.roomHash == hash):
            return item.name


def addPlayerToRoom(name, hash):
    print "TIME TO DO SOME STUFF RIGHT NAWH"
    print name
    users = database.User.query.all()
    for user in users:
        if user.username.lower() == name.lower():
            rooms = database.Room.query.all()
            for room in rooms:
                if room.roomHash == hash:
                    if notInArray(user.joinedRooms.split(','), hash):
                        database.User.query.filter_by(username=name).update(
                            dict(joinedRooms=user.joinedRooms + ',' + hash))
                        print "addingroom to user " + user.username + "room :" + hash
                        database.db.session.commit()
                    if notInArray(room.players.split(','), name):
                        players = room.players + ',' + name
                        database.Room.query.filter_by(roomHash=hash).update(dict(players=players))
                        database.db.session.commit()


def addRooms():
    global rooms
    result = database.Room.query.all()
    list = []
    for room in result:
        name = database.User.query.filter_by(id=str(room.creator)).first()
        json = {
            'creatorRank': getUserRank(name.username),
            'creator': name.username,
            'name': room.name,
            'players': len(room.players.split(',')),
            'inPlay': False,
            'hash': getRoomHashByUser(name.username)
        }
        list.append(json)
    rooms = list


def notInArray(list, value):
    print list
    print value
    for item in list:
        if str(item).lower() == str(value).lower():
            return False

    return True


def removeArrayItem(array, value):
    newArray = array
    for item in newArray:
        if item == value:
            newArray.remove(value)
    return newArray


def updateBoard(hash, data):
    result = database.Room.query.all()
    newData = ''
    database.Room.query.filter_by(roomHash=hash).update(dict(board=str(data)))
    database.db.session.commit()


def returnBoard(hash):
    result = database.Room.query.all()
    for item in result:
        if item.roomHash.lower() == hash.lower():
            return item.board


def returnTurn(hash):
    result = database.Room.query.all()
    for item in result:
        if item.roomHash.lower() == hash.lower():
            return item.turn


def updateTurn(hash, turn):
    database.Room.query.filter_by(roomHash=hash).update(dict(turn=str(turn)))
    database.db.session.commit()

def updatePlayerScore(players,winner):
    users = database.User.query.all()
    print 'spelers die meedoen: '+players
    players = players.split(',')
    if winner == 'white':
        wins = int(database.User.query.filter_by(username=players[0]).first().wins)+1
        database.User.query.filter_by(username=players[0]).update(dict(wins=str(wins)))
        loses = int(database.User.query.filter_by(username=players[1]).first().loses)+1
        database.User.query.filter_by(username=players[1]).update(dict(loses=str(loses)))
    elif winner == 'black':
        wins = int(database.User.query.filter_by(username=players[1]).first().wins)+1
        database.User.query.filter_by(username=players[1]).update(dict(wins=str(wins)))
        loses = int(database.User.query.filter_by(username=players[0]).first().loses)+1
        database.User.query.filter_by(username=players[0]).update(dict(loses=str(loses)))
    database.db.session.commit()

def getUserStats(name):
    return {
        'wins':database.User.query.filter_by(username=name).first().wins,
        'loses':database.User.query.filter_by(username=name).first().loses
    }