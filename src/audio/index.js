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

        //number of oscillators (breaks somewhere over 500)
        this.numoscs = 300


        //set min and max frequencies for oscillator distribution
        this.fmin = 40
        this.fmax = 16000 

        //set power law exponent for frequency sampling distribution 
        //1 is linear (more top heavy, equal across frequencies)
        //0 is log (more bottom heavy, equal across octaves)
        this.alpha = 0.7

        //set power law for oscillator amplitudes
        // 0 is flat (more top heavy, equal across frequencies)
        // -0.5 is 1/f  (more bottom heavy, equal across octaves)
        this.beta = -1.8


        //set oscillator start times for phase randomization and playing notes in succession
        this.spread = 50 //size of phase randomization window in ms
        this.delay = 0.2 //time between successive notes in s
  
    }


    //powerlaw cumulative distribution function for mapping random numbers from 0 to 1 into the frequency window
    //using alpha sample frequencies for the oscillators
    g(){
        if(this.alpha == 0){
            return Math.pow(Math.E,Math.random()*(Math.log(this.fmax)-Math.log(this.fmin))+Math.log(this.fmin))
        } else {
            return Math.pow(Math.random()*(Math.pow(this.fmax,this.alpha)-Math.pow(this.fmin,this.alpha))+Math.pow(this.fmin,this.alpha),1/this.alpha)
        }

    }


    play() {             
         

        //selects frequencies according to powerlaw distribution g()
        this.freqs = Array(this.numoscs).fill().map(() => this.g()) 
        
        //sets individual gains to powerlaw beta and master gain to normalize them
        this.gainvals = this.freqs.map(f => Math.pow(f,this.beta)) 
        this.gain.gain.value = 1.2 / this.gainvals.reduce((a,b) => a+b) //sets master gain to a/(sum of individual)
        
        

        //initialize then set individual oscillators and gains
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
            this.oscs[i].start(audioContext.currentTime + Math.random()*this.spread/1000.0 + this.delay*i)
            
         }


    }

    stop() {
        for(var i = 0; i < this.oscs.length; i++){
            this.oscs[i].stop()
        }
    }
}