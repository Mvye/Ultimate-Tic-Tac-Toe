import { render, screen } from "@testing-library/react";
import onClickBox from "./App";
import Board from "./Board";
import UsersList from './UsersList';
import Leaderboard from './Leaderboard';

test("Board changes when imitating click", () => {
  const initialBoard = ["","","","","","","","",""];
  const { rerender } = render(<Board board={initialBoard} click={(index) => onClickBox(index)} />);
  const box = screen.queryByText("X");
  expect(box).toBe(null);
  
  const boardAfterClick = ["","","","","","X","","",""];
  rerender(<Board board={boardAfterClick} click={(index) => onClickBox(index)} />);
  const boxAfterClick = screen.getByText("X");
  expect(boxAfterClick).toBeInTheDocument();
});

test("UserList updates when new player joins", () => {
  const initialPlayers = ["bob"];
  const initialSpectators = [];
  const { rerender } = render(<UsersList players={initialPlayers} spectators={initialSpectators} />);
  expect(screen.getByText('bob')).toBeInTheDocument();
  expect(screen.queryByText('joe')).toBe(null);
  
  const playersAfterJoin = ["bob","joe"];
  const spectatorsAfterJoin = [];
  rerender(<UsersList players={playersAfterJoin} spectators={spectatorsAfterJoin} />);
  expect(screen.getByText('bob')).toBeInTheDocument();
  expect(screen.getByText('joe')).toBeInTheDocument();
});

test("Current user is highlighted in leaderboard", () => {
  const username = "joe";
  const leaderboard = [{score: 101, username: "joe"}, {score: 100, username: "thomas"}, {score: 99, username: "bob"}];
  render(<Leaderboard username={username} leaderboard={leaderboard} />);
  const currentUser = screen.getByLabelText("current-user");
  const joe = screen.getByText(username);
  const bob = screen.getByText("bob");
  const thomas = screen.getByText("thomas");
  
  expect(joe).toBe(currentUser);
  expect(bob).not.toBe(currentUser);
  expect(thomas).not.toBe(currentUser);
});
