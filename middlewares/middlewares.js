//To-do: create middleware that determines the winner at the end of the game

// How to calculate the winner? 
// 1. If someone guessed correctly, and other didn't
// 2. Both guessed correctly
//   a. Compare number of attempts
//     i. If same, it's tie
// 3. Neither guessed correctly
//   a. Within history of guesses, who had the best (correct locations + correct numbers) wins