import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

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
    if (len(players) < 2):
        players.append(username)
        return players.index(username)
    else:
        spectators.append(username)
        return 2

def createPlayerData(status, username):
    data = {
        "players": players,
        "spectators": spectators,
        "type": status,
        "username": username
    }
    return data

@socketio.on('requestLogin')
def on_request_login(data):
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
    print(str(data))
    socketio.emit('turn',  data, broadcast=True, include_self=False)
    socketio.emit('switch', data, broadcast=True, include_self=True)

voted = []
@socketio.on('end')
def on_end(data): 
    print(str(data))
    votes = { "vote": len(voted) }
    socketio.emit('end',  data, broadcast=True, include_self=False)
    socketio.emit('voting', votes, broadcast=True, include_self=True)

def canVote(username):
    if username in players and username not in voted:
        return True
    else:
        return False

def addVote(username):
    print("Received vote from " + username)
    voted.append(username)
    return { "vote": len(voted) }

@socketio.on('vote')
def on_vote(data):
    username = data["username"]
    if canVote == False:
        print("Invalid vote received")
    votes = addVote(username)
    socketio.emit('voting', votes, broadcast=True, include_self=True)
    if len(voted) == 2:
        socketio.emit('again', votes, broadcast=True, include_self=True)
        voted.clear()
        

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)