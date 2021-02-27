import logo from './logo.svg';
import './App.css';
import './Board.css';
import { Board } from './Board.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [piece, setPiece] = useState(0);
  const [next, setNext] = useState("X");
  
  function onClickBox(index) {
    if (board[index] == "") {
      if (piece == 0) {
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
    }
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('turn', (data) => {
      console.log('Turn event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setBoard(prevList => Object.assign([...prevList], {[data.index]: data.piece}));
      setPiece(data.nextPiece);
      setNext(data.nextNext);
    });
  }, []);

  return (
    <div>
        <Board board={board} click={(index) => onClickBox(index)}/>
        <p> Next turn: {next}</p>
    </div>
  );
}

export default App;