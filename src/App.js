import logo from './logo.svg';
import './App.css';
import './Board.css';
import { Board } from './Board.js';
import { Message } from './Message.js';
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
  const [status, setStatus] = useState(-1);
  
  const loginRef = useRef(null);
  
  function onClickBox(index) {
    if (!isClickable) {
      return
    }
    var boardAfterTurn = Object.assign([...board], {[index]: next});
    if (board[index] === "") {
      if (piece === 0) {
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
          socket.emit('end', {outcome: outcome, text: "The winner is: "});
          setMessage("The winner is " + outcome);
        } else {
          socket.emit('end', {outcome: outcome, text: "There was a "});
          setMessage("There was a " + outcome);
        }
      }
    }
  }
  
  function onClickLogin() {
    if (loginRef != null) {
      const pickedUsername = loginRef.current.value;
      socket.emit('requestLogin', {sid: sid, requestedUsername: pickedUsername});
    }
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
      setStatus(data.status);
      setUsername(data.username);
    });
    socket.on('joined', (data) => {
      console.log(data);
    });
    socket.on('turn', (data) => {
      console.log('Turn event received!');
      console.log(data);
      
      setBoard(prevList => Object.assign([...prevList], {[data.index]: data.piece}));
      setPiece(data.nextPiece);
      setNext(data.nextNext);
    });
    socket.on('end', (data) => {
      console.log('End event received!');
      console.log(data);
      
      setIsClickable(false);
      setGameEnd(true);
      setMessage(data.text + data.outcome);
    });
  }, []);
  
  if (status == -1) {
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
        <Message next={next} end={gameEnd} message={message}/>
      </div>
    );
  }
}

export default App;