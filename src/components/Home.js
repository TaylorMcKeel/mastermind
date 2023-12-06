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
    let nums
    await axios.get('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new' )
      .then(res=> nums = res.data.split('\n'))
    
    nums.pop()
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
        <Link to="/gameplay" onClick={async () => { await this.startNewGame() }}>Lets Begin</Link>
      </div>
    )
     
  }
}

export default (Home)