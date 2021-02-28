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

def createPlayerData(players, username_position, username):
    if username_position < 2:
        status = username_position # Player 1 or 2
    else:
        status = 2 # Spectator
        
    data = {
        "players": players,
        "status": status,
        "position": username_position,
        "username": username
    }
    return data
    
players = []
@socketio.on('requestLogin')
def on_request_login(data):
    username = data["requestedUsername"]
    sid = data["sid"]
    players.append(username)
    new_data = {
        "players": players
    }
    socketio.emit('joined', new_data, broadcast=True, include_self=False)
    socketio.emit('approved', createPlayerData(players, players.index(username), username), room=sid)

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('turn')
def on_turn(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('turn',  data, broadcast=True, include_self=False)
    
@socketio.on('end')
def on_end(data): 
    print(str(data))
    socketio.emit('end',  data, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)