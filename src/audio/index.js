import { audioContext } from '../context/audio'

export class AudioEngine {
    constructor() { 
        // ADDED A GAIN NODE.
        // its important to reduce the gain of the output of both oscillators
        // when the resulting signal is their superposition. this is due to the
        // fact that their amplitudes are summed and sometimes above 1 and below -1.
        // but if we reduce the overall amplitude (with a gain node), we won't experience
        // clipping/distortion.
        //ja;sdlkjdsa;f
        // try messing around with different gain values!
        this.fund = 256 // sets frequency of first oscillator
        //this.freqs = [ 4, 5, 6,7, 8, 10, 12,14, 16, 20, 24,28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256] //frequency ratios
        //this.freqs = [...Array(128)].map((_, i) => 1 + i ) //all da harmonix babbyyy
        this.freqs  = [4, 5, 6, 7, 8, 9]
        this.freqs = this.freqs.map(x => x*this.fund/this.freqs[0]) //absolute frequencies


        this.gainvals = this.freqs.map(f => Math.pow(f,-0.5)) //sets individual gains f^n
        this.gain = audioContext.createGain()
        this.gain.gain.value = 1 / this.gainvals.reduce((a,b) => a+b) //sets master gain to a/(sum of individual)
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
            this.spread = 0 //size of phase randomization window in ms
            this.delay = 1/8 //time between successive notes in s
            this.oscs[i].start(audioContext.currentTime + Math.random()*this.spread/1000.0 + this.delay*i)
            
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}

/* 
const choose = (choices, cdf) =>
  choices[cdf.filter(c => c <= Math.random() * cdf[cdf.length - 1]).length]

const choices = [440, 550, 660, 840]
const pdf = [ 0.1, 0.5, 0.3, 0.1 ]

const cdf = pdf.map(p => (acc = p + acc))
choose(choices, cdf) // output a frequencey (from the choices Array) according to the pdf provided */