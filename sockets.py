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
    updatePlayerScore(playersInRoom(session['room'], True), data, session['room'])
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
    redrawBoard(data['hash'], data['board'])
    emit('redrawBoard', data, room=session['room'])


@socketio.on('strikePiece', namespace='/game')
def strikePiece(data):
    emit('strikeEnemy', data, room=session['room'])


@socketio.on('getTeam', namespace='/game')
def getTeam(data):
    print data
    session['room'] = data['hash']
    join_room(session['room'])
    emit("playersInRoom", playersInRoom(data['hash'], True))
    room = database.Room.query.filter_by(roomHash=session['room']).first()
    creator = database.User.query.filter_by(id=room.creator).first()
    print "user :" + session['username']
    print "creator :" + creator.username
    if session['username'] == creator.username:
        team = 'white'
        emit('receiveTeam', {'team': team,
                             'board': returnBoard(data['hash']),
                             'turn': returnTurn(data['hash'])}
        )
    else:
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
        #emit('lobbyCreated', rooms, broadcast=True)
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
    result = database.User.query.filter_by(username=user).first()
    avatar = ''
    if result:
        avatar = result.color + result.rank.title()
        return avatar


def createRoom(creator, name):
    hasher = hashlib.md5()
    hasher.update(creator)
    result = database.User.query.filter_by(username=creator).first()
    if result:
        print name.lower()
        room = database.Room(result.id, name, str(hasher.hexdigest()), '')
        database.db.session.add(room)
        database.db.session.commit()


# def deleteRoom(id):
#     result = database.Room.query.all()
#     for u in result:
#         if u.id == id.lower():
#             players = database.User.query.all()
#             for player in players:
#                 if not notInArray(u.players.split(','), player.username):
#                     database.User.query.filter_by(username=player.username).update(
#                         dict(str(removeArrayItem(player.joinedRooms.split(','), u.roomHash))))
#                     database.db.session.commit()
#         database.Room.query.filter_by(id=id).first().delete()
#         database.db.session.commit()


def playersInRoom(hash, names):
    print "you called me"
    room = database.Room.query.filter_by(roomHash=hash).first()
    players = {
        'white': "",
        'black': ""
    }
    amount = 0
    for player in room.players:
        user = database.User.query.filter_by(id=player.user).first()
        if player.user == room.creator:
            players['white'] = user.username
        else:
            players['black'] = user.username
        amount += 1

    if names:
        return players
    else:
        return amount


def getRoomHashByUser(name):
    room = database.Room.query.filter_by(creator=name).first()
    if room:
        return room.roomHash



def getRoomName(hash):
    result = database.Room.query.filter_by(roomHash=hash).first()
    if result:
        return result.name


def addPlayerToRoom(name, hash):
    print "TIME TO DO SOME STUFF RIGHT NAWH"
    print name
    room = database.Room.query.filter_by(roomHash=hash).first()
    user = database.User.query.filter_by(username=name.lower()).first()
    if room and user:
        room.add_user(user.id)




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
            'players': playersInRoom(room.roomHash, False),
            'inPlay': False,
            'hash': room.roomHash
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


def redrawBoard(hash, data):
    database.Room.query.filter_by(roomHash=hash).update(dict(board=str(data)))
    database.db.session.commit()


def returnBoard(hash):
    result = database.Room.query.filter_by(roomHash=hash).first()
    if result:
        return result.board


def returnTurn(hash):
    result = database.Room.query.filter_by(roomHash=hash).first()
    if result:
        return result.turn


def updateTurn(hash, turn):
    database.Room.query.filter_by(roomHash=hash).update(dict(turn=str(turn)))
    database.db.session.commit()


def updatePlayerScore(players, winner, room):
    print "help"
    print players
    white = database.User.query.filter_by(username=players['white']).first()
    black = database.User.query.filter_by(username=players['black']).first()
    if winner == 'white':
        white.add_win()
        black.add_lose()
    elif winner == 'black':
        white.add_lose()
        black.add_win()
    room = database.Room.query.filter_by(roomHash=room).first()
    database.db.session.delete(room)
    database.db.session.commit()


def getUserStats(name):
    return {
        'wins': database.User.query.filter_by(username=name).first().wins,
        'loses': database.User.query.filter_by(username=name).first().loses
    }

