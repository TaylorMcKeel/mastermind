import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

//since only one game runs at a time, when this component mounts all games are deleted.
  useEffect(() => {
    const deleteGames = async () => {
      try {
        await axios
          .delete("/api/games")
          .then((res) => console.log(`${res} was deleted from the database`));
      } catch (err) {
        console.log(err)
      }
    };

    deleteGames();
  }, []);

  //this function gets 4 random numbers from the api, and sends the new game to the database.
  const startNewGame = async () => {
    let nums
    try {
      await axios
        .get(
          "https://www.random.org/integers/",
          {
            params: {
              'num': 4,
              'min': 0,
              'max': 7,
              'col': 1,
              'base': 10,
              'format': 'plain',
              'rnd': 'new'
            }
          }
        )
        .then((res) => {nums = res.data.split("\n")});
    } catch (err) {
      console.log(err)
    }
    nums.pop();
    try {
      await axios.post("/api/games", {
        numbers: nums,
        plays: 0,
        prevPlays: [],
      });
    } catch (err) {
      console.log(err)
    }
  };

//this funtion allows us to wait until a new game is created to navigate to the next component
  const onLetsBeginClicked = async () => {
    try {
      await startNewGame();
    } catch (err) {
      console.log(err)
    }
    navigate("/gameplay");
  };

  return (
    <div class='textAndButton'>
      <h1 >Mastermind</h1>
      <button onClick={onLetsBeginClicked}>Let's Begin</button>
    </div>
  );
};

export default Home;