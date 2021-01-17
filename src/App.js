import { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';
import { AudioEngine } from './audio'


function App() {
  const [audioEngine, setAudioEngine] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setAudioEngine(new AudioEngine())
  }, [])

  const togglePlay = e => {
    if (isPlaying) {
      setIsPlaying(false)
      audioEngine.stop()
    } else {
      setIsPlaying(true)
      audioEngine.play()
    }
  }

  return (
    <div className="App">
      {
        audioEngine === null 
          ? null
          : <button onClick={togglePlay}>{ isPlaying ? 'stop' : 'play'}</button>
      }
    </div>
  );
}

export default App;
