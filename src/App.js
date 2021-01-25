import { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';

import { AudioEngine } from './audio'
import { Pattern } from './pattern'



function App() {
  const [audioEngine, setAudioEngine] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pattern, setPattern] = useState([])
  const [convolutionSize, setConvolutionSize] = useState(0)
  const [convolvedPattern, setConvolvedPattern] = useState([])

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

  const convolve = () => {
    // make sure convolution size is a valid int
    //f (!parseInt(convolutionSize)) return
    let _pattern = pattern
    if (convolvedPattern.length !== 0) _pattern = convolvedPattern

    // TODO write some interesting convolution here.....
    // use convolutionSize
    let result = []
    for (const step of _pattern) {
      result = [...result, ...(step ? pattern : pattern.map(s => !s))]
    }

    // set the convolution pattern
    setConvolvedPattern(result)
  }

  useEffect(() => {
    if (audioEngine === null) return
    audioEngine.setPattern(convolvedPattern)
  }, [convolvedPattern])

  if (audioEngine === null) return null

  const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <div className="App" style={style}>
      <Pattern pattern={pattern} setPattern={setPattern}/>
      <input type="text" value={convolutionSize} onChange={ e => setConvolutionSize(e.target.value) }/>
      <button onClick={convolve}>convolve</button>
      <button onClick={togglePlay}>{ isPlaying ? 'stop' : 'play'}</button>
      <Pattern name="convolved-sequence" pattern={convolvedPattern} setPattern={setConvolvedPattern} noAddition={true}/>
    </div>
  );
}

export default App;
