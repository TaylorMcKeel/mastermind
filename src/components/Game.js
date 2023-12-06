import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export class Game extends Component{
  constructor(){
    super()
    this.state={
      game: {},
      guess: [],
      gameOver: 0
    }
  }

  async componentDidMount(){
    await axios.get('/api/games')
      .then(res => {
        this.setState({game: res.data})
        if(res.data[0]['plays'] >9){
          this.setState({gameOver: 1})
        }
      })
  }

  async checkAnswer(){
    this.state.game[0]['prevPlays'].push(this.state.guess)
    this.state.game[0]['plays']++
    await axios.put(`/api/games/${this.state.game[0]._id}`, this.state.game[0])
    if(this.state.guess.join('') === this.state.game[0]['numbers'].join('')){
      this.setState({gameOver: 2})
    } else if(this.state.game[0]['plays'] >9){
      this.setState({gameOver: 1})
    }else{
      location.reload()
    }
  }

  render(){
    console.log(this.state)
    if(this.state.gameOver === 1){
      return(
        <div>
          <h1>Game Over</h1>
          <Link to='/'>Play Again</Link>
        </div>
      )
    }
    if(this.state.gameOver === 2){
      return(
        <div>
          <h1>YOU WIN</h1>
          <Link to='/'>Play Again</Link>
        </div>
      )
    }
    if(this.state.game[0] && this.state.gameOver === 0){
      const game = this.state.game[0]
      let count = 10 - game['plays']
      return (
       <div>
        <p>You have {count} turns remaining</p>
        <form>
          <input  type="text" id='guess' name='guess' onChange={(ev)=>{
            const guess = ev.target.value.split('')
            guess.map((curr)=>{Number(curr)})
            this.setState({guess: guess})}}/>
          <button type="button" onClick={()=>{this.checkAnswer()}}>Submit</button>
        </form>
        <ul>
          {game['prevPlays'].toReversed().map((play)=>{
            let numbersRight = 0
            let placesRight = 0
            for(let i=0;i<play.length;i++){
              if(game['numbers'].includes(play[i])){
                numbersRight++
                if(i === game['numbers'].indexOf(play[i])){
                  placesRight++
                }
              }
            }
            return(
              <div>
                <p>{play}</p>
                <p>Numbers Correct: {numbersRight}</p>
                <p>Places Correct: {placesRight}</p>
              </div>
            )
          })}
        </ul>
       </div>
      )
    }
  }
}

export default (Game)