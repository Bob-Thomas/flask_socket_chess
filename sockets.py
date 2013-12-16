from gevent import monkey; monkey.patch_all()
from flask import Flask, request, send_file
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
from flask.ext.sqlalchemy import SQLAlchemy
import re
import database

# The socket.io namespace
rooms = []

class Chess(BaseNamespace, RoomsMixin, BroadcastMixin):

    def on_move(self, data):
        self.emit_to_room('main_room', 'move enemy', data)
        print "ALA AKBHAR"

    def on_join(self, nickname):
        self.socket.session['nickname'] = nickname
        self.broadcast_event('announcement', '%s has connected' % nickname)
        # Just have them join a default-named room
        self.join('lobby')
        print "connected"
    def on_create(self, data):
        print data
        self.join(data['roomName'])
        self.room = {
            'name': data['roomName'],
            'players': 1,
            'inPlay': False

        }
        print rooms
        rooms.append(self.room)
        self.broadcast_event('lobbyCreated', rooms)


    def on_user_message(self, msg):
        self.emit_to_room('main_room', 'msg_to_room', self.socket.session['nickname'], msg )

    def recv_message(self, message):
        print "PING!!!", message

    def on_verify(self, data):
        if data.has_key('value'):
            print data['value']
            print "validating"
            print checkUser(data['name'],data['value'], database.User,)
            self.emit('validation', {'name':data['name'],'answer': checkUser(data['name'],data['value'], database.User,)})


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
