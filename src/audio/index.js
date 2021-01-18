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
        this.gain = audioContext.createGain()
        this.gain.gain.value = 0.5
        this.gain.connect(audioContext.destination)
    }

    play() {                
        this.freqs = [800.0, 440.0]
        this.oscs = new Array(this.freqs.length)
        for(var i = 0; i < this.freqs.length; i++){
            this.oscs[i] = audioContext.createOscillator()
            this.oscs[i].type = 'sine'
            this.oscs[i].frequency.value = this.freqs[i]
            this.oscs[i].connect(this.gain)
            
            this.oscs[i].start()
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}