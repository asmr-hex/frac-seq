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
        this.gain.connect(audioContext.destination)
    }

    play() {             
        this.freqmin = 40
        this.freqmax = 2048  

        //selects frequencies uniformly on log scale 
        //this.freqs = Array(200).fill().map(() => Math.pow(Math.E,Math.random()*(Math.log(this.freqmax)-Math.log(this.freqmin))+Math.log(this.freqmin))) //absolute frequencies
        
        //selects frequecys uniformly on linear scale
        this.freqs = Array(200).fill().map(() => Math.random()*(this.freqmax-this.freqmin)+this.freqmin) //absolute frequencies
        
        this.gainvals = this.freqs.map(f => Math.pow(f,-0.5)) //sets individual gains f^n
        this.gain.gain.value = 1 / this.gainvals.reduce((a,b) => a+b) //sets master gain to a/(sum of individual)
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
            this.spread = 100 //size of phase randomization window in ms
            this.delay = 0.0 //time between successive notes in s
            this.oscs[i].start(audioContext.currentTime + Math.random()*this.spread/1000.0 + this.delay*i)
            
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}