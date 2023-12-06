import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export class Home extends Component{
  constructor(){
    super()
  }

  async componentDidMount(){
   await axios.delete('/api/games')
    .then(res=> console.log(`${res} was deleted from the database`))
  }

  async startNewGame(){
    const nums = []
    for(let i=0;i<4;i++){
      let num = Math.floor(Math.random() * 9)
      while(nums.includes(num.toString())){
        num = Math.floor(Math.random() * 9)
      }
      nums.push(num.toString())
    }
    await axios.post('/api/games',{
      "numbers": nums,
      "plays": 0,
      "prevPlays": []
    })
  }
  render(){
   
    return(
      <div>
        <h1>Mastermind</h1>
        <Link to="/gameplay" onClick={()=>{this.startNewGame()}}>Lets Begin</Link>
      </div>
    )
     
  }
}

export default (Home)