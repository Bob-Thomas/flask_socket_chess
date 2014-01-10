from gevent import monkey; monkey.patch_all()
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


    def on_turnOver(self,data):
        print "boe"
        if data == 'white':
            self.emit_to_room(self.socket.session['room'], 'getTurn', 'black')
        else:
            self.emit_to_room(self.socket.session['room'], 'getTurn', 'white')

    def on_movePiece(self,data):
        self.emit_to_room(self.socket.session['room'], 'moveEnemy',data)


    def on_strikePiece(self,data):
        self.emit_to_room(self.socket.session['room'], 'strikeEnemy',data)

    def on_getTeam(self,data):
        print data
        self.socket.session['room'] = data['hash']
        self.join(data['hash'])
        team = 'white'
        print playersInRoom(data['hash'],data['name'])
        if playersInRoom(data['hash'],data['name']) == 1:
            team = 'white'
            self.emit('receiveTeam',team)
        elif playersInRoom(data['hash'],data['name']) == 2:
            team = 'black'
            self.emit('receiveTeam',team)

    def on_enterLobby(self, data):
        addRooms()
        self.socket.session['nickname'] = data
        print "test"
        print self.socket.session['nickname']
        m = datetime.now().minute
        h = datetime.now().hour
        message = {
            'rank':'bK',
            'name':"ALL MIGHTY SEVER",
            'time':str(h)+":"+str(m),
            'message':'%s has connected' % self.socket.session['nickname']
        }
        self.broadcast_event('message', message)
        # Just have them join a default-named room
        self.join('lobby')
        self.emit('nickname', {
            'name':self.socket.session['nickname'],
            'rank':getUserRank(self.socket.session['nickname'])
        })
        self.broadcast_event('lobbyCreated', rooms)
        print "connected"

    def on_create(self, data):
        print data['roomName']
        createRoom(self.socket.session['nickname'],data['roomName'])

        self.room = {
            'creatorRank':getUserRank(self.socket.session['nickname']),
            'creator':self.socket.session['nickname'],
            'name': data['roomName'],
            'players': 1,
            'inPlay': False,
            'hash':getRoomHashByUser(self.socket.session['nickname'])

        }
        print rooms
        rooms.append(self.room)
        self.broadcast_event('lobbyCreated', rooms)

    def on_joinGame(self,data):
        print "game Joined"
        self.join(data['hash'])
        addPlayerToRoom(data['name'],data['hash'])

    def on_sendMessage(self, msg):
        print "boe"
        self.broadcast_event('message', msg)

    def recv_message(self, message):
        print "PING!!!", message

    def on_verify(self, data):
        if data.has_key('value'):
            print data['value']
            print "validating"
            print checkUser(data['name'],data['value'], database.User,)
            self.emit('validation', {'name':data['name'],'answer': checkUser(data['name'],data['value'], database.User,)})

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
                'rank':'bK',
                'name':"ALL MIGHTY SEVER",
                'time':str(h)+":"+str(m),
                'message':'%s has disconnected' % nickname
            }
            self.broadcast_event('message', message)
            self.disconnect(silent=True)
            self.broadcast_event('lobbyCreated', rooms)
        return True



def checkUser(type ,value, table):
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
            avatar = u.color+u.rank.title()
    return avatar

def createRoom(creator,name):
    hasher = hashlib.md5()
    hasher.update(creator)
    result = database.User.query.all()
    for u in result:
        if u.username.lower() == creator.lower():
            print name.lower()
            room = database.Room(u.id,name,creator.lower(),str(hasher.hexdigest()))
            database.db.session.add(room)
            database.db.session.commit()


def deleteRoom(id):
    result = database.Room.query.all()
    for u in result:
        if u.id == id.lower():
            room = database.Room(u.creator,u.name,u.players)
            database.db.session.delete(room)
            database.db.session.commit()

def playersInRoom(hash,name):
    result = database.Room.query.all()
    for item in result:
        if(item.roomHash == hash):
            amountPlayers = item.players.split(',')
            if len(amountPlayers) == 1:
                return 1
            if len(amountPlayers) == 2:
                for players in amountPlayers:
                    if players.lower() == name.lower():
                        return amountPlayers.index(players)+1

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
        if(item.roomHash == hash):
            return item.name


def addPlayerToRoom(name,hash):
    print "TIME TO DO SOME STUFF RIGHT NAWH"
    users = database.User.query.all()
    for user in users:
        if user.username.lower() == name.lower():
            rooms = database.Room.query.all()
            for room in rooms:
                if room.roomHash == hash and name != room.players:
                    print "yush"
                    players = room.players+','+name
                    database.Room.query.filter_by(roomHash=hash).update(dict(players=players))
                    database.db.session.commit()
                    break

def addRooms():
    global rooms
    result = database.Room.query.all()
    list = []
    for room in result:
        name = database.User.query.filter_by(id=str(room.creator)).first()
        json = {
            'creatorRank':getUserRank(name.username),
            'creator':name.username,
            'name': room.name,
            'players': len(room.players.split(',')),
            'inPlay': False,
            'hash':getRoomHashByUser(name.username)
        }
        list.append(json)
    rooms = list
