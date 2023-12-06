# Mastermind Game

Thank you for playing mastermind. The purpose of this app is to create a brain teaser game where the user plays against the computer trying to guess a 4 digit number.

## How Do I play

- The game will begin on the homepage with the title of the game and a link that says "Lets Begin"
- Once you click the link the computer will automatically generate a 4 digit number.
  - Each digit will be a number between 0-7
- After each guess the computer will tell you if you are correct
  - If you are not correct the computer will tell you how many of your numbers were correct, and if how many were in the correct position (if any)
- You will have 10 tries to guess the correct series of numbers.
- If correct you will be taken to a new screen showing you won.
- If you run out of tries you will be taken to anew screen saying you lost.

## How can I run this app?

This app was built using React.

- Create a `.env` file. In it, you need to have the following keys: `PORT=5001` and `MONGO_URL = mongodb+srv://josephmckeel:t1a2y3@cluster0.rvutz9g.mongodb.net/?retryWrites=true&w=majority`

- install the appropriate libraries by running `npm i` in the terminal
- Run `npm run start-dev` in your terminal.
- Open your browser to `http://localhost:5001/`

## Thought Process

## Code Structure
