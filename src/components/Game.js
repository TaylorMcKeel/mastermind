import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Fix try and catch
// Fix game[0]
// Check what happens when you do 0222
// Game over cunt
const Game = () => {
  const [game, setGame] = useState({});
  const [guess, setGuess] = useState([]);
  const [gameOverCount, setGameOverCount] = useState(0);
  const [error, setError] = useState("");

  const count = game[0] ? 10 - game[0]["plays"] : 10;

  useEffect(() => {
    const getInitialGame = async () => {
      try {
        await axios.get("/api/games").then((res) => {
          console.log(res);
          setGame(res.data);
          if (count === 0) {
            setGameOverCount(1);
          }
        });
      } catch (error) {
        console.log(error)
      }
    };
    getInitialGame();
  }, []);

  const checkAnswer = async () => {
    if (guess.length === 4) {
      setError("");
      let updatedGame = { ...game[0] };
      updatedGame.prevPlays.push(guess);
      updatedGame.plays++;
      try {
        await axios.put(`/api/games/${updatedGame._id}`, updatedGame);
      } catch(err) {
        console.log(err)
        setError("App Error - Please try again.");
      }
      if (guess.join("") === updatedGame['numbers'].join("")) {
        setGameOverCount(2);
        console.log(gameOver)
      } else if (updatedGame['plays'] > 9) {
        setGameOverCount(1);
      } else {
        setGame({ ...game, [0]: updatedGame });
        setGuess([]);
      }
    } else {
      setError("Must have 4 digits");
    }
  };

  const handleGuessChange = (ev) => {
    const newGuess = ev.target.value;
    if (newGuess.length > 4 || isNaN(newGuess) ) {
      return;
    }
    for(let i=0;i<newGuess.length;i++){
      if(newGuess[i] > 7){
        return
      }
    }

    setGuess(newGuess.split(""));
  };

  const countNumbers = (game) => {
    return game["numbers"].reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});
  };

  // Function to calculate scores
  const calculateScores = (play, game, checkNums) => {
    let numbersRight = 0;
    let placesRight = 0;
    for (let i = 0; i < play.length; i++) {
      if (checkNums[play[i]] && checkNums[play[i]] > 0) {
        numbersRight++;
        checkNums[play[i]]--;
        if (play[i] === game["numbers"][i]) {
          placesRight++;
        }
      }
    }
    return { numbersRight, placesRight };
  };

  const previousGames = () => {
    const prevPlays = game[0]["prevPlays"];
    return prevPlays.toReversed().map((play) => {
      const checkNums = countNumbers(game[0]);
      const { numbersRight, placesRight } = calculateScores(
        play,
        game[0],
        checkNums
      );
      return (
        <div key={play.join("")}>
          <p>{play}</p>
          <p>Numbers Correct: {numbersRight}</p>
          <p>Places Correct: {placesRight}</p>
        </div>
      );
    });
  };

  return (
    <>
      {error}
      {gameOverCount === 1 && (
        <div>
          <h1>Game Over</h1>
          <Link to="/">Play Again</Link>
        </div>
      )}
      {gameOverCount === 2 && (
        <div>
          <h1>YOU WIN</h1>
          <Link to="/">Play Again</Link>
        </div>
      )}
      {gameOverCount === 0 && game[0] && (
        <div>
          <p>You have {count} turns remaining</p>
          <form>
            <input
              type="text"
              id="guess"
              value={guess.join("")}
              name="guess"
              onChange={handleGuessChange}
            />
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

          <ul>{previousGames()}</ul>
        </div>
      )}
    </>
  );
};

export default Game;