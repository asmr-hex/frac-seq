import { audioContext } from '../context/audio'

export class AudioEngine {
    constructor() { 
        this.osc = null
    }

    play() {
        this.osc = audioContext.createOscillator()
        this.osc.type = 'sine'
        this.osc.frequency.value = 440.1
        this.osc.connect(audioContext.destination)

        this.osc.start()
    }

    stop() {
        if (this.osc === null) return
        
        this.osc.stop()
    }
}