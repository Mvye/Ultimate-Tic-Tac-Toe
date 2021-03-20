'''Connects multiple players and spectators to play tic tac toe'''
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating DB variable to prevent
# circular import issues
import models

DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''I have no idea what this does'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''Prints user connected in console on connect'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''Prints user disconnected in console on disconnect'''
    print('User disconnected!')


PLAYERS = []
SPECTATORS = []


def update_status(username):
    '''Adds the user to either players or spectators and gives them their status'''
    if len(PLAYERS) < 2:
        PLAYERS.append(username)
        return PLAYERS.index(username)
    SPECTATORS.append(username)
    return 2


def create_player_data(status, username, leaderboard):
    '''Creates dictionary with current players, spectators, and client's status'''
    data = {
        "players": PLAYERS,
        "spectators": SPECTATORS,
        "leaderboard": leaderboard,
        "type": status,
        "username": username
    }
    return data


def get_leaderboard():
    '''Gets players from database sorted descending by score'''
    users = DB.session.query(models.Gamer).order_by(models.Gamer.score.desc())
    leaderboard = []
    for i in users:
        leaderboard.append({"username": i.username, "score": i.score})
    print(leaderboard)
    return leaderboard


def check_if_in_database(username):
    '''Checks if username is already in the database'''
    player_search = models.Gamer.query.filter_by(username=username).first()
    return player_search


def add_to_database(username):
    '''Adds gamer with given username to database'''
    new_player = models.Gamer(username=username, score=100)
    DB.session.add(new_player)
    DB.session.commit()
    users = []
    for gamer in models.Gamer.query.all():
        users.append(gamer.username)
    return users


@SOCKETIO.on('requestLogin')
def on_request_login(data):
    '''Adds new user to players or spectators,
    sends updated lists to all users, sends client their status'''
    username = data["requestedUsername"]
    sid = data["sid"]
    if check_if_in_database(username) is None:
        add_to_database(username)
    leaderboard = get_leaderboard()
    status = update_status(username)
    SOCKETIO.emit('approved',
                  create_player_data(status, username, leaderboard),
                  room=sid)
    new_data = {
        "players": PLAYERS,
        "spectators": SPECTATORS,
        "leaderboard": leaderboard
    }
    SOCKETIO.emit('joined', new_data, broadcast=True, include_self=False)


@SOCKETIO.on('turn')
def on_turn(data):
    '''When a player's turn ends, emits the updated board to all other users and switches turns'''
    print(str(data))
    SOCKETIO.emit('turn', data, broadcast=True, include_self=False)
    SOCKETIO.emit('switch', data, broadcast=True, include_self=True)

@SOCKETIO.on('taken')
def on_taken(data):
    '''When a big box is taken, emits updated big board to all other users'''
    print(str(data))
    SOCKETIO.emit('taken', data, broadcast=True, include_self=False)

def get_players():
    '''Gets the two players from database'''
    player_x = DB.session.query(
        models.Gamer).filter_by(username=PLAYERS[0]).first()
    player_o = DB.session.query(
        models.Gamer).filter_by(username=PLAYERS[1]).first()
    return [player_x, player_o]


def update_scores(outcome, player_x, player_o):
    '''Gives the winning player +1 to their score and the losing player -1'''
    if outcome == "X":
        player_x.score = player_x.score + 1
        player_o.score = player_o.score - 1
        DB.session.commit()
    elif outcome == "O":
        player_x.score = player_x.score - 1
        player_o.score = player_o.score + 1
        DB.session.commit()
    print("Player X score: " + str(player_x.score) + " Player O score: " +
          str(player_o.score))
    return [player_x.score, player_o.score]


VOTED = []


@SOCKETIO.on('end')
def on_end(data):
    '''After game is over, emits the updated board to all other users and triggers voting'''
    print(str(data))
    players = get_players()
    update_scores(data["outcome"], players[0], players[1])
    leaderboard = get_leaderboard()
    votes = {"vote": len(VOTED)}
    SOCKETIO.emit('end', data, broadcast=True, include_self=False)
    SOCKETIO.emit('voting', votes, broadcast=True, include_self=True)
    SOCKETIO.emit('leaderboard', {"leaderboard": leaderboard},
                  broadcast=True,
                  include_self=True)


def can_vote(username):
    '''Helper method to determine if user can increment vote'''
    if username in PLAYERS and username not in VOTED:
        return True
    return False


def add_vote(username):
    '''Helper method to increment vote and return the updated vote count'''
    print("Received vote from " + username)
    VOTED.append(username)
    return {"vote": len(VOTED)}


def vote_occur(username):
    '''Adds vote to vote list and emits updated vote count to everyone'''
    votes = add_vote(username)
    SOCKETIO.emit('voting', votes, broadcast=True, include_self=True)
    if len(VOTED) == 2:
        SOCKETIO.emit('again', votes, broadcast=True, include_self=True)
        VOTED.clear()


@SOCKETIO.on('vote')
def on_vote(data):
    '''Checks if vote is valid, applies vote if it is; once vote is
    at required threshold emits to trigger game restart'''
    username = data["username"]
    if not can_vote(username):
        print("Invalid vote received")
    else:
        vote_occur(username)


# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call SOCKETIO.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
