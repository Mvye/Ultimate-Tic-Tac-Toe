import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
from models import User

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

@socketio.on('requestLogin')
def on_request_login(data):
    '''Adds new user to players or spectators, sends updated lists to all users, sends client their status'''
    username = data["requestedUsername"]
    sid = data["sid"]
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

voted = []
@socketio.on('end')
def on_end(data):
    '''After game is over, emits the updated board to all other users and triggers voting'''
    print(str(data))
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

@socketio.on('vote')
def on_vote(data):
    '''Checks if vote is valid, applies vote if it is; once vote is at required threshold emits to trigger game restart'''
    username = data["username"]
    if canVote == False:
        print("Invalid vote received")
    votes = addVote(username)
    socketio.emit('voting', votes, broadcast=True, include_self=True)
    if len(voted) == 2:
        socketio.emit('again', votes, broadcast=True, include_self=True)
        voted.clear()

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
