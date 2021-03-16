'''Sets up Player model'''
from app import DB


class Player(DB.Model):
    '''Creates player model for database with attribute username and score'''
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<Player %r>' % self.username
