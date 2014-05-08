import re
from datetime import datetime
import database
import hashlib
from flask.ext.socketio import *
from chess import *
# The socket.io namespaces
rooms = []
socketio = SocketIO(app)


@socketio.on('move', namespace='/game')
def move(data):
    emit('move enemy', data)


@socketio.on('sendMessageGameroom', namespace='/game')
def sendMessageGameroom(data):
    emit('gameMessage', data, room=data['hash'])


@socketio.on('turnOver', namespace='/game')
def turnOver(data):
    print "boe"
    print data
    turn = ""
    if data['turn'] == 'white':
        turn = 'white'
        emit('getTurn', turn, room=data['hash'])
    else:
        turn = 'black'
        emit('getTurn', turn, room=data['hash'])
    updateTurn(data['hash'], turn)


@socketio.on('gameOver', namespace='/game')
def gameOver(data):
    updatePlayerScore(playersInRoom(data['room'], 'banan', True), data)
    emit('gameFinished', data, room=session['room'])


@socketio.on('addDummy', namespace='/game')
def addDummy(data):
    emit('addDummy', data, room=session['room'])


@socketio.on('removeDummy', namespace='/game')
def removeDummy(data):
    emit('removeDummy', data, room=session['room'])


@socketio.on('movePiece', namespace='/game')
def movePiece(data):
    emit('moveEnemy', data, room=session['room'])


@socketio.on('promotePiece', namespace='/game')
def promotePiece(data):
    emit('promotePiece', data, room=session['room'])


@socketio.on('updateBoard', namespace='/game')
def updateBoard(data):
    updateBoard(data['hash'], data['board'])
    emit('redrawBoard', data, room=session['room'])


@socketio.on('strikePiece', namespace='/game')
def strikePiece(data):
    emit('strikeEnemy', data, room=session['room'])


@socketio.on('getTeam', namespace='/game')
def getTeam(data):
    print data
    session['room'] = data['hash']
    join_room(session['room'])
    print "spelers - " + str(playersInRoom(data['hash'], data['name'], False))
    emit("playersInRoom", playersInRoom(data['hash'], data['name'], True))
    if playersInRoom(data['hash'], data['name'], False) == 1:
        team = 'white'
        emit('receiveTeam', {'team': team,
                             'board': returnBoard(data['hash']),
                             'turn': returnTurn(data['hash'])}
        )
    elif playersInRoom(data['hash'], data['name'], False) == 2:
        team = 'black'
        emit('receiveTeam', {'team': team,
                             'board': returnBoard(data['hash']),
                             'turn': returnTurn(data['hash'])})


@socketio.on('enterLobby', namespace='/lobby')
def enterLobby(data):
    print "WEEEEEEe"
    addRooms()
    session['nickname'] = data
    print "test"
    print session['nickname']
    m = datetime.now().minute
    h = datetime.now().hour
    message = {
        'rank': 'bK',
        'name': "ALL MIGHTY SEVER",
        'time': str(h) + ":" + str(m),
        'message': '%s has connected' % session['nickname']
    }
    emit('message', message, broadcast=True)
    # Just have them join a default-named room
    join_room('lobby')
    emit('nickname', {
        'name': session['nickname'],
        'rank': getUserRank(session['nickname']),
        'wins': getUserStats(session['nickname'])['wins'],
        'loses': getUserStats(session['nickname'])['loses']
    })
    emit('lobbyCreated', rooms, broadcast=True)
    print "connected"


@socketio.on('create', namespace='/lobby')
def create(data):
    print data['roomName']
    createRoom(session['nickname'], data['roomName'])

    room = {
        'creatorRank': getUserRank(session['nickname']),
        'creator': session['nickname'],
        'name': data['roomName'],
        'players': 1,
        'inPlay': False,
        'hash': getRoomHashByUser(session['nickname'])

    }
    print rooms
    rooms.append(room)
    emit('lobbyCreated', rooms, broadcast=True)


@socketio.on('joinGame', namespace='/lobby')
def joinGame(data):
    print "game Joined"
    join_room(data['hash'])
    addPlayerToRoom(data['name'], data['hash'])


@socketio.on('sendMessage', namespace="/lobby")
def endMessage(msg):
    print "boe"
    emit('message', msg, broadcast=True)


@socketio.on('verify')
def verify(data):
    if 'value' in data:
        print data['value']
        print "validating"
        print checkUser(data['name'], data['value'], database.User, )
        emit('validation',
                  {'name': data['name'], 'answer': checkUser(data['name'], data['value'], database.User, )})

@socketio.on('disconnect', namespace="/lobby")
def disconnect():
    # Remove nickname from the list
    if 'nickname' in session:
        nickname = session['nickname']
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
        emit('message', message, broadcast=True)
        emit('lobbyCreated', rooms, broadcast=True)
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
            if item.roomHash == hash:
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


def updatePlayerScore(players, winner):
    users = database.User.query.all()
    print 'spelers die meedoen: ' + players
    players = players.split(',')
    if winner == 'white':
        wins = int(database.User.query.filter_by(username=players[0]).first().wins) + 1
        database.User.query.filter_by(username=players[0]).update(dict(wins=str(wins)))
        loses = int(database.User.query.filter_by(username=players[1]).first().loses) + 1
        database.User.query.filter_by(username=players[1]).update(dict(loses=str(loses)))
    elif winner == 'black':
        wins = int(database.User.query.filter_by(username=players[1]).first().wins) + 1
        database.User.query.filter_by(username=players[1]).update(dict(wins=str(wins)))
        loses = int(database.User.query.filter_by(username=players[0]).first().loses) + 1
        database.User.query.filter_by(username=players[0]).update(dict(loses=str(loses)))
    database.db.session.commit()


def getUserStats(name):
    return {
        'wins': database.User.query.filter_by(username=name).first().wins,
        'loses': database.User.query.filter_by(username=name).first().loses
    }

