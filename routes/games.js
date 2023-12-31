const express = require('express')
const router = express.Router()


const {  
  getGame,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController')

router.route('/')
  .get(getGame)
  .post(createGame)
  .delete(deleteGame)

router.route('/:gameId')
  .put(updateGame)

  
//To-do: add get game route /:gameId


module.exports = router