import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

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

  const onLetsBeginClicked = async () => {
    try {
      await startNewGame();
    } catch (err) {
      console.log(err)
    }
    navigate("/gameplay");
  };

  return (
    <div>
      <h1>Mastermind</h1>
      <button onClick={onLetsBeginClicked}>Let's Begin</button>
    </div>
  );
};

export default Home;