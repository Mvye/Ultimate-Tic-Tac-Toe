import logo from './logo.svg';
import './App.css';
import './Board.css';
import { Board } from './Board.js';
import { Message } from './Message.js';
import { UsersList } from './UsersList.js';
import { calculateWinner } from './calculateWinner.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

var sid;

socket.on("connect", () => {
  sid = socket.id;
  console.log(sid);
});

function App() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [piece, setPiece] = useState(0);
  const [next, setNext] = useState("X");
  const [isClickable, setIsClickable] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [type, setType] = useState(-1); // 0 for player x, 1 for player o, 2 for spectator, -1 for not logged in 
  const [vote, setVote] = useState(0);
  
  const typeRef = useRef(null);
  const loginRef = useRef(null);
  const endRef = useRef(null);
  
  typeRef.current = type;
  endRef.current = gameEnd;
  
  function onClickBox(index) {
    if (!isClickable) {return;}
    
    var boardAfterTurn = Object.assign([...board], {[index]: next});
    if (board[index] === "" && type !== 2) {
      if (type === 0) {
        setBoard(prevList => Object.assign([...prevList], {[index]: "X"}));
        setPiece(1);
        setNext("O");
        socket.emit('turn', { index: index, piece: "X", nextPiece: 1, nextNext: "O"});
      }
      else {
        setBoard(prevList => Object.assign([...prevList], {[index]: "O"}));
        setPiece(0);
        setNext("X");
        socket.emit('turn', { index: index, piece: "O", nextPiece: 0, nextNext: "X"});
      }
      const outcome = calculateWinner(boardAfterTurn);
      if (outcome !== null) {
        setIsClickable(false);
        setGameEnd(true);
        if (outcome !== "tie") {
          const text = "The winner is " + players[piece] + " (" + outcome + ")";
          socket.emit('end', {outcome: outcome, text: text});
          setMessage(text);
        } else {
          socket.emit('end', {outcome: outcome, text: "There was a "});
          setMessage("There was a " + outcome);
        }
      }
    }
  }
  
  function onClickLogin() {
    if (loginRef !== null) {
      const pickedUsername = loginRef.current.value;
      socket.emit('requestLogin', {sid: sid, requestedUsername: pickedUsername});
    }
  }
  
  function onClickPlayAgain() {
    if (type === 2) {return;}
    socket.emit('vote', {username: username});
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('approved', (data) => {
      console.log('Login approved');
      console.log(data);
      setPlayers(data.players);
      setSpectators(data.spectators);
      setType(data.type);
      console.log(data.type);
      setUsername(data.username);
      if (data.type !== 0) {
        setIsClickable(false);
      }
    });
    socket.on('joined', (data) => {
      console.log('New player joined');
      console.log(data);
      setPlayers(data.players);
      setSpectators(data.spectators);
    });
    socket.on('turn', (data) => {
      console.log('Turn event received!');
      console.log(data);
      
      setBoard(prevList => Object.assign([...prevList], {[data.index]: data.piece}));
      setPiece(data.nextPiece);
      setNext(data.nextNext);
    });
    socket.on('switch', (data) => {
      console.log('Switching clickable');
      if (!endRef.current) {
        if (typeRef.current == 0 || typeRef.current == 1) {
          setIsClickable(prevClickable => !prevClickable);
        }
      }
    });
    socket.on('end', (data) => {
      console.log('End event received!');
      console.log(data);
      
      setIsClickable(false);
      setGameEnd(true);
      if (data.outcome == 'tie') {
        setMessage(data.text + data.outcome);
      } else {
        setMessage(data.text);
      }
    });
    socket.on('voting', (data) => {
      console.log('Voting event received');
      console.log(data);
      setVote(data.vote);
    });
    socket.on('again', (data) => {
      console.log('Game is restarting');
      setBoard(board);
      setGameEnd(false);
      setPiece(0);
      setNext(next);
      setVote(0);
      if (typeRef.current == 0) {
        setIsClickable(true);
      }
    });
  }, []);
  
  if (type === -1) {
    return (
      <div>
        <input ref={loginRef} type="text" />
        <button onClick={onClickLogin}>login</button>
      </div>
    );
  } else {
    return (
      <div>
        <Board board={board} click={(index) => onClickBox(index)}/>
        <Message next={next} piece={piece} players={players} end={gameEnd} message={message} vote={vote} click={() => onClickPlayAgain()}/>
        <UsersList players={players} spectators={spectators} />
      </div>
    );
  }
}

export default App;