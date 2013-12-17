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
# The socket.io namespace
rooms = []


class Room(BaseNamespace, RoomsMixin, BroadcastMixin):

    def on_move(self, data):
        self.emit_to_room('main_room', 'move enemy', data)
        print "ALA AKBHAR"

    def on_joinGame(self,data):
        self.join(data['room'])

    def on_enterLobby(self, data):
        self.socket.session['nickname'] = data
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
        print data
        self.join(data['roomName'])
        self.room = {
            'creatorRank':getUserRank(self.socket.session['nickname']),
            'creator':self.socket.session['nickname'],
            'name': data['roomName'],
            'players': 1,
            'inPlay': False

        }
        print rooms
        rooms.append(self.room)
        self.broadcast_event('lobbyCreated', rooms)

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