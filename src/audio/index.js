import { audioContext } from '../context/audio'

export class AudioEngine {
    constructor() { 
        
        
    }

    play() {
        this.freqs = [220.0, 275.0]
        this.oscs = new Array(this.freqs.length)
        for(var i = 0; i < this.freqs.length; i++){
            this.oscs[i] = audioContext.createOscillator()
            this.oscs[i].type = 'sine'
            this.oscs[i].frequency.value = this.freqs[i]
            this.oscs[i].connect(audioContext.destination)
            this.oscs[i].start()
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}