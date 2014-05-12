from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:de_dust@localhost/chess'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(120))
    password = db.Column(db.String(80))
    loses = db.Column(db.Integer)
    wins = db.Column(db.Integer)
    rank = db.Column(db.String(1))
    color = db.Column(db.String(1))
    rooms = db.relationship('UserInRoom', backref='User', lazy='dynamic')


    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email
        self.wins = 0
        self.loses = 0
        self.rank = 'p'
        self.color = 'b'
        self.joinedRooms = ''

        def __repr__(self):
            return '<User %r>' % self.username

    def add_win(self):
        self.wins = self.wins + 1

    def add_lose(self):
        self.loses = self.loses + 1


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.Integer, db.ForeignKey('user.id',
                                                  onupdate="RESTRICT", ondelete="CASCADE"))
    name = db.Column(db.String(80))
    roomHash = db.Column(db.String(200))
    board = db.Column(db.String(2000))
    turn = db.Column(db.String(20))
    players = db.relationship('UserInRoom', backref='Room', lazy='dynamic')

    def __init__(self, creator, name, hash, board):
        self.creator = creator
        self.name = name
        self.roomHash = hash
        self.board = board
        self.turn = "white"

        def __repr__(self):
            return '<User %r>' % self.username


    def add_user(self, user_id):
        user_in_room = UserInRoom(user_id, self.id)
        db.session.add(user_in_room)
        db.session.commit()


class UserInRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id',
                                               onupdate="RESTRICT", ondelete="CASCADE"))
    room = db.Column(db.Integer, db.ForeignKey('room.id',
                                               onupdate="RESTRICT", ondelete="CASCADE"))

    def __init__(self, user, room):
        self.user = user
        self.room = room


db.create_all()
