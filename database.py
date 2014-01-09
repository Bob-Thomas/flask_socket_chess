from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Bcrich3445@localhost/chess'
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


    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email
        self.wins = 0
        self.loses = 0
        self.rank = 'p'
        self.color = 'b'

        def __repr__(self):
            return '<User %r>' % self.username

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(80))
    players = db.Column(db.String(200))
    roomHash =  db.Column(db.String(200))

    def __init__(self, creator, name,players,hash):
        self.creator = creator
        self.name = name
        self.players = players
        self.roomHash = hash


        def __repr__(self):
            return '<User %r>' % self.username



db.create_all()
