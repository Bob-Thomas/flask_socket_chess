from gevent import monkey; monkey.patch_all()
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash,send_from_directory
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
        print "yata"
        return redirect(url_for('index'))
    return render_template('login.html')


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
    SocketIOServer(('0.0.0.0', port), app, namespace="socket.io", policy_server=True).serve_forever()
    

