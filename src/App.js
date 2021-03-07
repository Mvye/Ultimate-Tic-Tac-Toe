import './App.css';
import './Board.css';
import { Board } from './Board.js';
import { Message } from './Message.js';
import { UsersList } from './UsersList.js';
import { calculateWinner } from './calculateWinner.js';
import { Leaderboard } from './Leaderboard.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

var sid;

socket.on("connect", () => {
  sid = socket.id;
  console.log(sid);
});

function App() {
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [type, setType] = useState(-1);
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState(0);
  const [next, setNext] = useState("X");
  const [isClickable, setIsClickable] = useState(true);
  const [message, setMessage] = useState("");
  const [gameEnd, setGameEnd] = useState(false);
  const [vote, setVote] = useState(0);
  
  const loginRef = useRef(null);
  const typeRef = useRef(null);
  const endRef = useRef(null);
  
  typeRef.current = type;
  endRef.current = gameEnd;
  
  function onClickLogin() {
    if (loginRef !== null) {
      const pickedUsername = loginRef.current.value;
      socket.emit('requestLogin', {sid: sid, requestedUsername: pickedUsername});
    }
  }
  
  function updateStates(index, placedPiece, nextPlayer, nextPiece) {
    setBoard(prevList => Object.assign([...prevList], {[index]: placedPiece}));
    setPlayer(nextPlayer);
    setNext(nextPiece);
    socket.emit('turn', { index: index, piece: placedPiece, nextPiece: nextPlayer, nextNext: nextPiece});
  }
  
  function endGame(outcome) {
    setIsClickable(false);
    setGameEnd(true);
    if (outcome !== "tie") {
      const text = "The winner is " + players[player] + " (" + outcome + ")";
      socket.emit('end', {outcome: outcome, text: text});
      setMessage(text);
    } else {
      socket.emit('end', {outcome: outcome, text: "There was a "});
      setMessage("There was a " + outcome);
    }
  }
  
  function onClickBox(index) {
    if (!isClickable) {return;}
    var boardAfterTurn = Object.assign([...board], {[index]: next});
    if (board[index] === "" && type !== 2) {
      if (type === 0) {
        updateStates(index, "X", 1, "O");
      }
      else {
        updateStates(index, "O", 0, "X");
      }
      const outcome = calculateWinner(boardAfterTurn);
      if (outcome !== null) {
        endGame(outcome);
      }
    }
  }
  
  function onClickPlayAgain() {
    if (type === 2) {return;}
    socket.emit('vote', {username: username});
  }

  useEffect(() => {
    socket.on('approved', (data) => {
      console.log('Login approved');
      console.log(data);
      setUsername(data.username);
      setPlayers(data.players);
      setSpectators(data.spectators);
      setLeaderboard(data.leaderboard);
      setType(data.type);
      if (data.type !== 0) {
        setIsClickable(false);
      }
    });
    socket.on('joined', (data) => {
      console.log('New player joined');
      console.log(data);
      setPlayers(data.players);
      setSpectators(data.spectators);
      setLeaderboard(data.leaderboard);
    });
    socket.on('turn', (data) => {
      console.log('Turn event received!');
      console.log(data);
      setBoard(prevList => Object.assign([...prevList], {[data.index]: data.piece}));
      setPlayer(data.nextPiece);
      setNext(data.nextNext);
    });
    socket.on('switch', (data) => {
      console.log('Switching clickable');
      if (!endRef.current) {
        if (typeRef.current === 0 || typeRef.current === 1) {
          setIsClickable(prevClickable => !prevClickable);
        }
      }
    });
    socket.on('end', (data) => {
      console.log('End event received!');
      console.log(data);
      setIsClickable(false);
      if (data.outcome === 'tie') {
        setMessage(data.text + data.outcome);
      } else {
        setMessage(data.text);
      }
      setGameEnd(true);
    });
    socket.on('voting', (data) => {
      console.log('Voting event received');
      console.log(data);
      setVote(data.vote);
    });
    socket.on('leaderboard', (data) => {
      console.log('Leaderboard updated');
      console.log(data);
      setLeaderboard(data.leaderboard);
    });
    socket.on('again', (data) => {
      console.log('Game is restarting');
      setBoard(board);
      setPlayer(0);
      setNext(next);
      if (typeRef.current === 0) {
        setIsClickable(true);
      }
      setGameEnd(false);
      setVote(0);
    });
  }, []);
  
  if (type === -1) {
    return (
      <div>
        <h2>Please pick a username to login!</h2>
        <input ref={loginRef} type="text" />
        <button onClick={onClickLogin}>login</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1> {players[0]} vs {players[1]} </h1>
        <Board board={board} click={(index) => onClickBox(index)}/>
        <Message next={next} player={player} players={players} end={gameEnd} message={message} vote={vote} click={() => onClickPlayAgain()}/>
        <UsersList players={players} spectators={spectators} />
        <Leaderboard leaderboard={leaderboard}/>
      </div>
    );
  }
}

export default App;