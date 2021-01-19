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
        this.fund = 56 // sets frequency of first oscillator
        this.freqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] //frequency ratios
        this.freqs = this.freqs.map(x => x*this.fund/this.freqs[0]) //absolute frequencies


        this.gainvals = this.freqs.map(x => Math.pow(x,-1.5)) //sets individual gains 1/f
        this.gain = audioContext.createGain()
        this.gain.gain.value = 0.8 / this.gainvals.reduce((a,b) => a+b) //sets master gain to a/(sum of individual)
        this.gain.connect(audioContext.destination)
    }

    play() {                
        this.oscs = new Array(this.freqs.length)
        this.gainz = new Array(this.freqs.length)
        for(var i = 0; i < this.freqs.length; i++){
            this.oscs[i] = audioContext.createOscillator()
            this.gainz[i] = audioContext.createGain()
            this.oscs[i].type = 'sine'
            this.oscs[i].frequency.value = this.freqs[i]
            this.gainz[i].gain.value = this.gainvals[i]
            this.oscs[i].connect(this.gainz[i])
            this.gainz[i].connect(this.gain)
            
            //starts oscillators at random time
            this.spread = 1/this.fund //size of phase randomization window in ms
            this.delay = 0.05//time between successive notes in s
            this.oscs[i].start(audioContext.currentTime + Math.random()*this.spread/1000.0 + this.delay*i)
            
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}