import { audioContext } from '../context/audio'

export class AudioEngine {
    constructor() { 
        // ADDED A GAIN NODE.
        // its important to reduce the gain of the output of both oscillators
        // when the resulting signal is their superposition. this is due to the
        // fact that their amplitudes are summed and sometimes above 1 and below -1.
        // but if we reduce the overall amplitude (with a gain node), we won't experience
        // clipping/distortion.
        //
        // try messing around with different gain values!
        this.freqs = [2,3,4,5,6,7,8,9,10].map(x => x*50)
        this.gain = audioContext.createGain()
        this.gain.gain.value = 1.0 / this.freqs.length
        this.gain.connect(audioContext.destination)
    }

    play() {                
        this.oscs = new Array(this.freqs.length)
        for(var i = 0; i < this.freqs.length; i++){
            this.oscs[i] = audioContext.createOscillator()
            this.oscs[i].type = 'sine'
            this.oscs[i].frequency.value = this.freqs[i]
            this.oscs[i].connect(this.gain)
            
            //starts oscillators at random time within first 50ms, but only works first time!!?!
            this.oscs[i].start(Math.random()/20)
            
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}