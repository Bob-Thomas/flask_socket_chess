from gevent import monkey; monkey.patch_all()
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
import sockets as chess
import database

Chess = chess.Chess
# Flask routes
app = Flask(__name__)
app.config.from_object('config')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        state = request.form['type']
        if state == 'login':
            username = request.form['username']
            password = request.form['password']
            login(username, password)
            return redirect(url_for('lobby'))
        elif state == 'register':
            username = request.form['username']
            password = request.form['password']
            repeat = request.form['repeat']
            email = request.form['email']
            register(username, password, repeat, email)
    return render_template('login.html')

@app.route('/lobby', methods=['GET', 'POST'])
def lobby():
    return render_template('chess.html')


def login(user,pw):
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

def register(username, pw, repeat, email):
    if pw == repeat:
        print username +" "+ pw+" "+repeat+" "+email
        user = database.User(username, pw, email)
        database.db.session.add(user)
        database.db.session.commit()


@app.route("/socket.io/<path:path>")
def run_socketio(path):
    socketio_manage(request.environ, {'': Chess})

if __name__ == '__main__':
    port = 9000
    print 'Listening on http://localhost:',port
    app.debug = True
    import os
    from werkzeug.wsgi import SharedDataMiddleware
    app = SharedDataMiddleware(app, {
        '/': os.path.join(os.path.dirname(__file__), 'static')
        })
    from socketio.server import SocketIOServer
    SocketIOServer(('0.0.0.0', port), app, namespace="socket.io", policy_server=False).serve_forever()
    

