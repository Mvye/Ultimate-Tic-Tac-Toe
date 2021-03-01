
# Project 2 Milestone 1  
This is a tic tac toe game made with react. 

# Steps to Deploy
This demo will show you how to get this game running for you!
## Clone the repository
1. On https://github.com/new, create a new personal repository with whatever name you want.
2. In terminal, in your home directory, clone the repo: `git clone https://github.com/NJIT-CS490-SP21/project2-mm2373`. 
3. `cd` into the repository that is created and you should see all the files now.
4. Then, connect this cloned repo to your new personal repo made in Step 1:  `git remote set-url origin https://www.github.com/{your-username}/{repo-name}`  (be sure to change your username and repo-name and remove the curly braces)
5. Run `git push origin main` to push the local repo to remote. You should see this same code in your personal repo.

## Setup a Heroku Account
Note: Skip if you do not want this website public.

1. Create a free account on Heroku  [here](https://signup.heroku.com/login). 

## Install Requirements (if you don't have them already)
1. `npm install`
2. `pip install Flask`
3. `npm install -g heroku`
4. `pip install -r requirements.txt`
5. `pip install flask-socketio`
6. `pip install flask-cors`

## Setup
1.  Run  `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local`  in the project directory
2.  `cd`  into  **`react-starter`**  directory.  then run  `npm install socket.io-client --save`

## Running the Application
1. Run the command `python app.py` in terminal.
2. Preview webpage in browser `'\'`.

## Deploying to Heroku
1.  Create a Heroku app:  `heroku create --buildpack heroku/python`
2.  Add nodejs buildpack:  `heroku buildpacks:add --index 1 heroku/nodejs`
3.  Push to Heroku:  `git push heroku main`

## Problems
1. Currently if one user joins and places their X on any box before anyone else joins, the game will be broken for anyone who joins later. Solution: Create a waiting room that only lets the first user place their X when there's another player in the game. This can be done with emitting events, similar to how voting to restart the game works. Maybe also implement a way for a new spectator to get the entire current board when they're admitted. This would likely be done by keeping the board data in the server.
2. If a player/spectator leaves, they're still kept on the player/spectator list respectively. This makes it so that one can only play the game once per running the python app. Solution: Short term solution could be a button that once pressed would clear the player/spectator list. Long term solution could be letting multiple tic tac toe games play which would all show up as a list and once the players of the game have left, the games would be removed. This might be able to be done with socket rooms where a new room is created when a new game is. 

## Solved Issues 
- **Issue #1:** When checking the board for if there was a winner, it would take one extra turn for the game to declare a winner/make the board unclickable.
   -  **Process:** Initially I believed the problem was with my clicking, but after testing and checking with logs I realized the problem was that when referencing a state variables in a function, they were static, meaning even if you altered them they wouldn't change in the function. Most of my searching and testing after learning this was related to trying to get by this. 
   - **Searches:** My searches were focused around state variables and how to access a changed state variable in a function. 
   - **Helpful Resources:** [Hooks state](https://reactjs.org/docs/hooks-state.html)
   - **Solution:** I looked through a lot of resources but none of them actually had a solution I could directly implement, it more so helped me realize what my problem was and why it was occurring. My problem was state variables are static in functions as they were at the start of the function, so when I was passing in my board into the calculateWinner function it would calculate the winner off of the board before a turn was made. This is why I would need one extra turn to calculateWinner. My solution was I would just make a variable copy of the board after the turn and pass that in to calculateWinner. 
- **Issue #2:** Login would not work correctly because I could not emit to a specific user.
   - **Process:**  My idea for login consisted of a request from the client to login with a specific username, then the server would send an updated player list to all clients and then a special approved event to the client which made the request. The problem was I could not get emitting to a specific client working. 
   - **Searches:** My initial searches had to do with emitting to a specific user. I tried to look for possible solutions in JS and Python's socketio. Later they were related to getting the socket id of a client.
   - **Helpful Resources:** [Socket id](https://socket.io/docs/v3/server-socket-instance/#Socket-id)
   - **Solution:** After doing a lot of research I learned that I could emit to a specific user if I had their socket id. With more searches I figured out a solution I could use. What I did was I save the socket id of the user when they first connect to the server (before logging on) on my App.js, then when requesting to login clients will sent their sid so the server can respond directly to them. The server will send a message similar to this `socketio.emit('approved', data, room=sid)`.

  
## Resources:
- [React hooks](https://reactjs.org/docs/hooks-state.html)
- [State variables](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)
- [Python socketio](https://python-socketio.readthedocs.io/en/latest/server.html#emitting-events)
- [Socket id](https://socket.io/docs/v3/server-socket-instance/#Socket-id)
- [Sending a specific message with socket io](https://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js )
- [Center in css](https://www.freecodecamp.org/news/how-to-center-anything-with-css-align-a-div-text-and-more/)