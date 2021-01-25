import { audioContext } from '../context/audio'

export class AudioEngine {
    constructor() { 
        this.osc = null
        this.pattern = []

        this.mainGain = audioContext.createGain()
        this.oscGain = audioContext.createGain()
        this.oscGain.gain.value = 0.5
        this.mainGain.gain.value = 1
        this.oscGain.connect(this.mainGain)
        this.mainGain.connect(audioContext.destination)

        this.timerFn = null
        this.stepIndex = 0
        this.lookAheadInterval = 100 // ms
        this.scheduleAheadTime = 0.1 // s
        this.nextStepTime = 0 // ms
        this.bpm = 460
    }

    start() {
        if (this.timerFn !== null) return

        this.timerFn = setInterval(() => {
            if (audioContext.state === "suspended") audioContext.resume()
            if (this.pattern === []) return

            while (this.nextStepTime < audioContext.currentTime + this.scheduleAheadTime) {
                this.scheduleStep(this.nextStepTime)
                this.nextStepTime += 60.0 / this.bpm // increment by seconds/beat
                this.stepIndex = (this.stepIndex + 1) % this.pattern.length
            }
        }, this.lookAheadInterval)
    }

    scheduleStep(time) {
        // get current step
        const step = this.pattern[this.stepIndex]
        if (step) {
            const osc = audioContext.createOscillator()
            osc.type = 'sine'
            osc.frequency.value = 500
            osc.connect(this.oscGain)
            osc.start(time)
            osc.stop(time + ((60.0 / this.bpm) * 0.9))
        }


        const id = `convolved-sequence-${this.stepIndex}`
        const el = document.getElementById(id)
        if (el === null) return
        el.style.border = '1px solid black'
        setTimeout(() => {
            el.style.border = '1px solid white'
        }, (60.0 / this.bpm) * 1000)
    }

    play() {
/*         this.osc = audioContext.createOscillator()
        this.osc.type = 'sine'
        this.osc.frequency.value = 440.1
        this.osc.connect(audioContext.destination)

        this.osc.start() */
        this.start()
    }

    stop() {
/*         if (this.osc === null) return
        
        this.osc.stop() */
        clearInterval(this.timerFn)
        this.timerFn = null
        audioContext.suspend()
    }

    setPattern(pattern) {
        this.pattern = pattern
    }
}