from gevent import monkey; monkey.patch_all()
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
import hashlib
import database
# Flask routes

app = Flask(__name__)
app.config.from_object('config')


@app.route('/', methods=['GET', 'POST'])
def index():
    if 'loggedIn' in session:
        return redirect(url_for('lobby'))
    if request.method == 'POST':
        state = request.form['formState']
        print "LOGIN FORM"
        print "STATE = " + state
        print '________________________________________'
        for input in request.form:
            print request.form[input]

        username = request.form['username']
        password = request.form['password']
        repeat = request.form['passwordRepeat']
        email = request.form['email']
        if state == 'login':
            if login(username, password):
                return redirect(url_for('lobby'))
            else:
                return render_template("login.html")
        elif state == 'register':
            print "boe"
            if register(username, password, repeat, email):
                session['loggedIn'] = True
                session['username'] = username.lower()
                return redirect(url_for('lobby'))
            else:
                return render_template('login.html')
    return render_template('login.html')




@app.route('/lobby', methods=['GET', 'POST'])
def lobby():
    if 'loggedIn' in session:
        result = database.User.query.all()
        avatar = ''
        for u in result:
            if u.username.lower() == session['username'].lower():
                avatar = u.color+u.rank.title()
        return render_template('lobby.html',user=session['username'],avatar=avatar)
    else:
        return "you are not allowed to be here go away GROWL..."

@app.route('/game/<room>', methods=['GET','POST'])
def game(room):
    roomHash = room
    print roomHash
    result = database.Room.query.all()
    for roomItem in result:
        print "room name input " + room
        print "room name database " + roomItem.players
        print "roomHash -> "+ roomHash
        if roomItem.roomHash == str(roomHash):
            if 'loggedIn' in session:
                print len(roomItem.players.split(',') )
                if len(roomItem.players.split(',')) <= 1:
                    rank = database.User.query.all()
                    avatar = ''
                    for u in rank:
                        if u.username.lower() == session['username'].lower():
                            avatar = u.color+u.rank.title()
                    result = None
                    return render_template('game.html',user=session['username'],avatar=avatar)
                else:
                    users = database.User.query.all()
                    for user in users:
                        for roomName in roomItem.players.split(','):
                            print session['username'].lower()
                            print roomName.lower()
                            if(session['username'].lower() == roomName.lower()):
                                rank = database.User.query.all()
                                avatar = ''
                                for u in rank:
                                    if u.username.lower() == session['username'].lower():
                                        avatar = u.color+u.rank.title()
                                result = None
                                return render_template('game.html',user=session['username'],avatar=avatar)
                        else:
                            result = None
                            return "this room is full"
            else:
                return "you are not allowed to be here go away GROWL... create an acount on <a href='www.bmthomas.nl:9000' >this site </a> Or LOGIN"

    else:
        return "This room does not exist"


def login(user, pw):
    result = database.User.query.all()
    for u in result:
        if u.username.lower() == user.lower():
            print "found user"
            print u.password
            if u.password == pw:
                session['loggedIn'] = True
                session['username'] = u.username.lower()
                print session['loggedIn']
                print session['username']
                return True
    else:
        return False


def register(username, pw, repeat, email):
    result = database.User.query.all()
    if pw == repeat:
        print username+" "+ pw+" "+repeat+" "+email
        user = database.User(username, pw, email)
        database.db.session.add(user)
        database.db.session.commit()
        return True



@app.teardown_request
def checkin_db(exc):
    try:
        database.db.session.close()
    except AttributeError:
        pass


@app.route("/socket.io/<path:path>")
def run_socketio(path):
    import sockets
    room = sockets.Room
    socketio_manage(request.environ, {'': room})

if __name__ == '__main__':
    port = 9000
    print 'Listening on http://localhost:', port
    app.debug = True
    import os
    from werkzeug.wsgi import SharedDataMiddleware
    app = SharedDataMiddleware(app, {
        '/': os.path.join(os.path.dirname(__file__), 'static')
        })
    from socketio.server import SocketIOServer
    SocketIOServer(('0.0.0.0', port), app, namespace="socket.io", policy_server=False).serve_forever()


