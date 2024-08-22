export default class Neander {
    constructor (RAM) {
        this.RAM = RAM
        this.PC = 0
        this.ACC = 0
        this.RI = [0]
        this.BP = Math.max(RAM.length - 1, 0)
        this.clockHLT = false
        this.counter = {
            accesses: 0,
            reads: 0,
            writes: 0,
            instructions: 0
        }
    }

    static instructions () {
        return {
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
            240: 'HLT'
        }
    }

    static getInstruction (n) {
        return (Neander.instructions())[n] || 'NOP'
    }

    control () {
        return [
            { key: 'N', state: this.ACC < 0 },
            { key: 'Z', state: this.ACC === 0 }
        ]
    }

    mnemonics () {
        return this.RAM.map((n, i, arr) => [16, 32, 48, 64, 80, 128, 144, 160].includes(arr[i - 1]) ? `[${n}]` : Neander.getInstruction(n))
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

    next () {
        this.RI = [Neander.getInstruction(this.read(this.PC))]
        this.PC += 1
        this[this.RI[0]]() // dynamic call
        this.counter.instructions += 1
    }

    nextLine () {
        this.RI = [...this.RI, this.read(this.PC)]
        this.PC += 1
    }

    NOP () {
        // do nothing
    }

    STA () {
        this.nextLine()
        this.write(this.RI[1], this.ACC) // Store
    }

    LDA () {
        this.nextLine()
        this.ACC = this.read(this.RI[1]) // Load
    }

    ADD () {
        this.nextLine()
        this.ACC += this.read(this.RI[1]) // ADD
    }

    OR () {
        this.nextLine()
        this.ACC = this.read(this.RI[1]) | this.ACC
    }

    AND () {
        this.nextLine()
        this.ACC = this.read(this.RI[1]) & this.ACC
    }

    NOT () {
        this.ACC = ~this.ACC
    }

    JMP () {
        this.nextLine()
        this.PC = this.RI[1]
    }

    JN () {
        this.nextLine()
        if (this.ACC < 0) this.PC = this.RI[1]
    }

    JZ () {
        this.nextLine()
        if (this.ACC === 0) this.PC = this.RI[1]
    }

    HLT () {
        this.clockHLT = true
    }
}
