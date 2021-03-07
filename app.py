import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

players = []
spectators = []
def updateStatus(username):
    '''Adds the user to either players or spectators and gives them their status'''
    if len(players) < 2:
        players.append(username)
        return players.index(username)
    else:
        spectators.append(username)
        return 2

def createPlayerData(status, username):
    '''Creates dictionary with current players, spectators, and client's status'''
    data = {
        "players": players,
        "spectators": spectators,
        "type": status,
        "username": username
    }
    return data

def addToDatabase(username):
    '''Adds newly joined player to the database if first time login'''
    player_search = models.Player.query.filter_by(username=username).first()
    if player_search is None:
        new_player = models.Player(username=username, score=100)
        db.session.add(new_player)
        db.session.commit()
    else:
        print(models.Player.query.filter_by(username=username).first().score)

@socketio.on('requestLogin')
def on_request_login(data):
    '''Adds new user to players or spectators, sends updated lists to all users, sends client their status'''
    username = data["requestedUsername"]
    sid = data["sid"]
    addToDatabase(username)
    new_data = {
        "players": players,
        "spectators": spectators
    }
    status = updateStatus(username)
    socketio.emit('joined', new_data, broadcast=True, include_self=False)
    socketio.emit('approved', createPlayerData(status, username), room=sid)

@socketio.on('turn')
def on_turn(data):
    '''When a player's turn ends, emits the updated board to all other users and switches turns'''
    print(str(data))
    socketio.emit('turn', data, broadcast=True, include_self=False)
    socketio.emit('switch', data, broadcast=True, include_self=True)

def update_scores(outcome):
    '''Gives the winning player +1 to their score and the losing player -1'''
    player_x = db.session.query(models.Player).filter_by(username=players[0]).first()
    player_o = db.session.query(models.Player).filter_by(username=players[1]).first()
    if outcome == "X":
        player_x.score = player_x.score + 1
        player_o.score = player_o.score - 1
        db.session.commit()
    elif outcome == "O":
        player_x.score = player_x.score - 1
        player_o.score = player_o.score + 1
        db.session.commit()
    print("Player X score: " + str(player_x.score) + " Player O score: " + str(player_o.score))

def get_leaderboard():
    '''Gets players from database sorted descending by score'''
    players = db.session.query(models.Player).order_by(models.Player.score.desc())
    leaderboard = []
    for i in players:
        leaderboard.append({
            "username": i.username,
            "score": i.score
        })
    print(leaderboard)
    return leaderboard

voted = []
@socketio.on('end')
def on_end(data):
    '''After game is over, emits the updated board to all other users and triggers voting'''
    print(str(data))
    update_scores(data["outcome"])
    leaderboard = get_leaderboard()
    votes = {"vote": len(voted)}
    socketio.emit('end', data, broadcast=True, include_self=False)
    socketio.emit('voting', votes, broadcast=True, include_self=True)

def canVote(username):
    '''Helper method to determine if user can increment vote'''
    if username in players and username not in voted:
        return True
    return False

def addVote(username):
    '''Helper method to increment vote and return the updated vote count'''
    print("Received vote from " + username)
    voted.append(username)
    return {"vote": len(voted)}

def vote_occur(username):
    '''Adds vote to vote list and emits updated vote count to everyone'''
    votes = addVote(username)
    socketio.emit('voting', votes, broadcast=True, include_self=True)
    if len(voted) == 2:
        socketio.emit('again', votes, broadcast=True, include_self=True)
        voted.clear()

@socketio.on('vote')
def on_vote(data):
    '''Checks if vote is valid, applies vote if it is; once vote is at required threshold emits to trigger game restart'''
    username = data["username"]
    if canVote(username) == False:
        print("Invalid vote received")
    else:
        vote_occur(username)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
