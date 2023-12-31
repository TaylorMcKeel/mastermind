import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



//To-Do:  add functionalility to calculate winner
  // Get user data
  // calculate winner
  // Navigate each user to the appropirate conmponent
//put functions in chronological order

const Game = () => {
  const [game, setGame] = useState({});
  const [guess, setGuess] = useState([]);
  const [gameOverCount, setGameOverCount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const count = game[0] ? 10 - game[0]["plays"] : 10;

  //grabs data from backend.
  useEffect(() => {
    const getInitialGame = async () => {
      try {
        await axios.get("/api/games")
          .then((res) => {
            setGame(res.data);
        });
      } catch (error) {
        console.log(error)
      }
    };
    getInitialGame();
  }, []);

  //makes sure user can only choose 4 numbers between 0-7
  const handleGuessChange = (ev) => {
    const newGuess = ev.target.value;
    if (newGuess.length > game[0]['difficulty'] || isNaN(newGuess) ) {
      setError(`Guess must be ${game[0]['difficulty']} numbers`)
      return;
    }
    for(let i=0;i<newGuess.length;i++){
      if(newGuess[i] > 7){
        setError('Number must be between 0-7')
        return
      }
    }

    setGuess(newGuess.split(""));
  };

  //checks users answer, and if they are out of turns
  const checkAnswer = async () => {
    if (guess.length === game[0]['difficulty']) {
      setError("");
      let updatedGame = { ...game[0] };
      updatedGame.prevPlays.push(guess);
      updatedGame.plays++;
      try {
        await axios.put(`/api/games/${updatedGame._id}`, updatedGame);
   // To-Do: What do we do if there is an error for the user
      } catch(err) {
        console.log(err)
      }
      if (guess.join("") === updatedGame['numbers'].join("")) {
        setGameOverCount(2);
      } else if (updatedGame['plays'] > 9) {
        setGameOverCount(1);
      } else {
        setGame({ ...game, [0]: updatedGame });
        setGuess([]);
      }
    } else {
      setError(`Must have ${game[0]['difficulty']} digits`);
    }
  };

//displays previous guesses made by user
  const displayPreviousGuesses = () => {
    const prevPlays = game[0]["prevPlays"];
    return prevPlays.toReversed().map((play) => {
      const hashMap = createHashmap(game[0]);
      const { numbersRight, placesRight } = calculateScores(
        play,
        game[0],
        hashMap
      );
      return (
        <div className='play' key={play.join("")}>
          <p className='playDetail'>{play}</p>
          <p className='playDetail'>Numbers Correct: {numbersRight}</p>
          <p className='playDetail'>Places Correct: {placesRight}</p>
        </div>
      );
    });
  };

  //creates a hashmap of the winning numbers
  const createHashmap = (game) => {
    return game["numbers"].reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});
  };

  // Function to calculate numbers right and places correct
  const calculateScores = (play, game, hashMap) => {
    let numbersRight = 0;
    let placesRight = 0;
    for (let i = 0; i < play.length; i++) {
      if (hashMap[play[i]] && hashMap[play[i]] > 0) {
        numbersRight++;
        hashMap[play[i]]--;
      }
      if (play[i] === game["numbers"][i]) {
        placesRight++;
      }
    }
    return { numbersRight, placesRight };
  };

  //deletes current game once game is over.
  const deleteCurrentGame = async()=>{
    try {
      await axios
        .delete("/api/games")
        .then((res) => console.log(`${res} was deleted from the database`));
    } catch (err) {
      console.log(err)
    }
  }

  //takes user back to the home page to start another game
  const navigateHome =async()=>{
    try {
      await deleteCurrentGame()
    } catch (err) {
      console.log(err)
    }
    navigate('/')
  }
  return (
    <>
      {gameOverCount === 1 && (
        <div className='textAndButton'>
          <h1>Game Over</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameOverCount === 2 && (
        <div className="animated-background">
          <h1>YOU WIN</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameOverCount === 0 && game[0] && (
        <div id='gamePlay'>
          <p>You have {count} turns remaining</p>
          <form>
            <input
              type="text"
              id="guess"
              value={guess.join("")}
              name="guess"
              onChange={handleGuessChange}
            />
            <p id='error'>{error}</p>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                checkAnswer();
              }}
            >
              Submit
            </button>
          </form>

          <ul id='prevPlays'>{displayPreviousGuesses()}</ul>
        </div>
      )}
    </>
  );
};

export default Game;