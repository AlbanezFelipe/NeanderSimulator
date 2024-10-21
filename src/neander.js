export default class Neander {
    constructor (RAM, eventCallback) {
        // Memory
        this.RAM = RAM

        // Registers
        this.MDR = 0
        this.MAR = 0
        this.PC = 0
        this.ACC = 0
        this.RI = 0
        this.OUT = 0

        // Control Unit bits
        this.controlUnit = {
            MR:  0, // Memory Read
            MW:  0, // Memory Write
            LMA: 0, // Load Memory Address
            LMD: 0, // Load Memory Data
            SA:  0, // Select Address
            IC:  0, // Increment counter
            LC:  0, // Load counter
            LI:  0, // Load Instruction
            LA:  0, // Load accumulator
            LF:  0, // Load Flags
            ADD: 0, // ALU ADD
            AND: 0, // ALU AND
            OR:  0, // ALU OR
            NOT: 0, // ALU NOT
            LDA: 0, // ALU LDA(Y)
            LO:  0, // Load Out
            HLT: 0, // Halt
            T0:  0  // Go to T0 (reset control timing counter)
        }

        // ALU Flags bits
        this.flags = {
            N: 0,
            Z: 0
        }

        // Instructions Map
        this.instructions = {
            0: 'NOP',
            16: 'STA',
            32: 'LDA',
            48: 'ADD',
            64: 'OR',
            80: 'AND',
            96: 'NOT',
            128: 'JMP',
            144: 'JN',
            160: 'JZ',
            200: 'OUT',
            240: 'HLT'
        }

        // Unit control timing counter
        this.controlTime = 0
        this.currentTime = null

        // Breakpoint value
        this.BP = Math.max(RAM.length - 1, 0)

        // History counter
        this.counter = {
            accesses: 0,
            reads: 0,
            writes: 0,
            instructions: 0
        }

        // Event callback for emit events with other modules
        this.eventCallback = eventCallback
    }

    read (address) {
        const data = this.RAM[address]
        this.counter.accesses += 1
        this.counter.reads += 1
        return data
    }

    write (address, data) {
        this.RAM[address] = data
        this.counter.accesses += 1
        this.counter.writes += 1
    }

    decoder (value) {
        return this.instructions[value] || 'NOP'
    }

    updateFlags (value) {
        this.flags = {
            N: !!(value & 128),
            Z: value === 0
        }
    }

    incrementPC () {
        const v = this.PC + 1
        this.PC = v > this.RAM.length - 1 ? 0 : v
    }

    gotoT0 () {
        this.controlTime = 0
        this.counter.instructions += 1
        this.eventCallback('T0')
    }

    HLT () {
        this.eventCallback('HLT')
    }

    setControlUnit (data) {
        this.controlUnit = Object.keys(this.controlUnit).reduce((o, k) => ({ ...o, [k]: +data.includes(k) }), {})
    }

    getMicroInstruction () {
        // from t0 to t2 (fetch)
        if (this.controlTime < 3) return this.controlTime === 0 ? ['LMA'] : (this.controlTime === 1 ? ['MR', 'IC'] : ['LI'])

        // from t3 to t7 (execution)
        const timingMicrocodes = {
            NOP: [['T0']],
            STA: [['LMA'], ['MR', 'IC'], ['SA', 'LMA'], ['LMD'], ['MW', 'T0']],
            LDA: [['LMA'], ['MR', 'IC'], ['SA', 'LMA'], ['MR'], ['LDA', 'LA', 'LF', 'T0']],
            ADD: [['LMA'], ['MR', 'IC'], ['SA', 'LMA'], ['MR'], ['ADD', 'LA', 'LF', 'T0']],
            OR:  [['LMA'], ['MR', 'IC'], ['SA', 'LMA'], ['MR'], ['OR', 'LA', 'LF', 'T0']],
            AND: [['LMA'], ['MR', 'IC'], ['SA', 'LMA'], ['MR'], ['AND', 'LA', 'LF', 'T0']],
            NOT: [['NOT', 'LA', 'LF', 'T0']],
            JMP: [['LMA'], ['MR'], ['LC', 'T0']],
            JN: this.flags.N ? [['LMA'], ['MR'], ['LC', 'T0']] : [['IC', 'T0']],
            JZ: this.flags.Z ? [['LMA'], ['MR'], ['LC', 'T0']] : [['IC', 'T0']],
            OUT: [['LO', 'T0']],
            HLT: [['HLT', 'T0']]
        }
        return timingMicrocodes[this.decoder(this.RI)][this.controlTime - 3] /// !!! || T0
    }

    runMicroInstruction () {
        if (this.controlUnit.LMA) { this.MAR = this.controlUnit.SA ? this.MDR : this.PC }
        if (this.controlUnit.MR)  { this.MDR = this.read(this.MAR) }
        if (this.controlUnit.MW)  { this.write(this.MAR, this.MDR) }
        if (this.controlUnit.LMD) { this.MDR = this.ACC }
        if (this.controlUnit.IC)  { this.incrementPC() }
        if (this.controlUnit.LC)  { this.PC = this.MDR }
        if (this.controlUnit.LI)  { this.RI = this.MDR }
        if (this.controlUnit.LO)  { this.OUT = this.ACC }

        let ALU = 0
        if (this.controlUnit.ADD) { ALU = (this.ACC + this.MDR) & 255 }
        if (this.controlUnit.AND) { ALU = this.ACC & this.MDR }
        if (this.controlUnit.OR)  { ALU = this.ACC | this.MDR }
        if (this.controlUnit.NOT) { ALU = this.ACC ^ 255 }
        if (this.controlUnit.LDA) { ALU = this.MDR }

        if (this.controlUnit.LA) { this.ACC = ALU }
        if (this.controlUnit.LF) { this.updateFlags(ALU) }

        if (this.controlUnit.T0) { this.gotoT0() } else { this.controlTime += 1 }
        if (this.controlUnit.HLT) { this.HLT() }
    }

    next () {
        this.setControlUnit(this.getMicroInstruction())
        this.currentTime = this.controlTime
        this.runMicroInstruction()
    }

    mnemonics () {
        return this.RAM.map((n, i, arr) => [16, 32, 48, 64, 80, 128, 144, 160].includes(arr[i - 1]) ? `[${n}]` : this.decoder(n))
    }

    resetCounter () {
        this.counter = { accesses: 0, reads: 0, writes: 0, instructions: 0 }
    }
}
