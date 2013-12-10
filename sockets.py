from gevent import monkey; monkey.patch_all()
from flask import Flask, request, send_file
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
from flask.ext.sqlalchemy import SQLAlchemy
import database

# The socket.io namespace

class Chess(BaseNamespace, RoomsMixin, BroadcastMixin):

    def on_move(self, data):
        self.emit_to_room('main_room', 'move enemy', data)
        print "ALA AKBHAR"

    def on_nickname(self, nickname):
        self.emit('check clients', self.amount)
        self.environ.setdefault('nicknames', []).append(nickname)
        self.socket.session['nickname'] = nickname
        self.broadcast_event('announcement', '%s has connected' % nickname)
        self.broadcast_event('nicknames', self.environ['nicknames'])
        # Just have them join a default-named room
        self.join('main_room')
        print "connected"


    def on_user_message(self, msg):
        self.emit_to_room('main_room', 'msg_to_room', self.socket.session['nickname'], msg )

    def recv_message(self, message):
        print "PING!!!", message

    def on_verify(self,data):
        if data.has_key('value'):
            print data['value']
            print "validating"
            print checkUser(data['name'],data['value'], database.User,)
            self.emit('validation', {'name':data['name'],'answer': checkUser(data['name'],data['value'], database.User,)})


def checkUser(type,value, table):
    if not value:
        return True
    result = table.query.all()
    if type == 'username':
        for u in result:
            if u.username == value:
                return True
            else:
                return False
    elif type == 'email':
        for u in result:
            if u.email == value:
                return True
            else:
                return False