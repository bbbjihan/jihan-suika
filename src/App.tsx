import { useState } from 'react'
import './App.css'
import Game from './Game'

function App() {
  const [score, setScore] = useState<number>(0)
  return (
    <div style={{width: '100%', height: '100%', justifyContent:'center', alignItems:'cetner'}}>
      <Game setScore={setScore}/>
      <div style={{}}>
        점수: {score}
      </div>
    </div>
  )
}

export default App
