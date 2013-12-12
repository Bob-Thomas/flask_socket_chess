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


    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

        def __repr__(self):
            return '<User %r>' % self.username

db.create_all()
