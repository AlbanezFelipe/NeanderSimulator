const historyLimit = 150

export default class Clock {
    constructor (callback) {
        this.mode = 0 // 0 = monoestable, 1 = astable
        this.state = 0 // 0 = Low, 1 = High
        this.history = []
        this.lastPoint = null
        this.frequency = 1000
        this.callback = callback
    }

    setPoint () {
        const now = new Date()
        if (!this.lastPoint) {
            this.lastPoint = now
            return
        }
        this.history = [...this.history, { state: this.state, length: now - this.lastPoint }]
        this.lastPoint = now

        if (this.history.length > historyLimit) this.history = this.history.slice(1)
    }

    setMode (mode) {
        if (this.mode === mode) return
        this.mode = mode
        if (mode === 1) this.tick()
    }

    tick () {
        this.setPoint()
        this.state = +(!this.state)
        if (this.state) this.callback()
        if (this.mode === 1 || (this.state === 1 && this.mode === 0)) setTimeout(() => { this.tick() }, this.frequency || 1)
    }

    trigger () {
        if (this.mode === 0 && this.state === 0) this.tick() // !!! and cancel astable tick timeout
    }
}
