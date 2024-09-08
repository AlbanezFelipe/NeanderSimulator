<template>
    <div>
        <canvas ref="architecture" width="400" height="800">
            Sorry, your browser does not support canvas.
        </canvas>
    </div>
</template>

<script>
const width = 400
const height = 800

import { defineComponent } from 'vue'
// pivot y: top=0  center=1 bottom=2
// pivot x: left=0 center=1 right=2
const transformPivot = (n, size, pivot) => {
    if (pivot === 0) return n
    if (pivot === 1) return n - size / 2
    if (pivot === 2) return n - size
}

const transformPivotXY = (x, y, width, height, pivotX, pivotY) => {
    return { x: transformPivot(x, width, pivotX), y: transformPivot(y, height, pivotY) }
}

const measureText = (ctx, text) => {
    const m = ctx.measureText(text)
    return {
        width: m.width,
        height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
    }
}

const drawRegister = (ctx, name, state, x, y, pivotX, pivotY, minWidth = 0) => {
    ctx.fillStyle = 'black'
    ctx.font = '18px Roboto Mono'
    const paddingX = 20
    const paddingY = 10
    const textSize = measureText(ctx, name)
    // console.log(textSize)
    const rectWidth = Math.max(textSize.width + paddingX * 2, minWidth)
    const rectHeight = textSize.height + paddingY * 2
    const coord = transformPivotXY(x, y, rectWidth, rectHeight, pivotX, pivotY)
    if (state) {
        ctx.fillStyle = '#ffff00'
        ctx.fillRect(coord.x, coord.y, rectWidth, rectHeight)
        ctx.fillStyle = 'black'
    }
    ctx.strokeRect(coord.x, coord.y, rectWidth, rectHeight)
    // console.log(coord.x, coord.y, rectWidth, rectHeight)
    ctx.fillText(name, coord.x + rectWidth / 2 - textSize.width / 2 /* coord.x + paddingX */, coord.y + (textSize.height) + paddingY)
    // ctx.fillText(name, x + padding, y)
    return { ...coord, width: rectWidth, height: rectHeight }
}

const drawALU = (ctx, x, y, width, height, pivotX, pivotY) => {
    const coord = transformPivotXY(x, y, width, height, pivotX, pivotY)
    ctx.beginPath()
    ctx.moveTo(coord.x, coord.y + height)
    ctx.lineTo(coord.x + width / 3, coord.y + height)
    ctx.lineTo(coord.x + width / 6 * 3, coord.y + height / 2)
    ctx.lineTo(coord.x + width / 3 * 2, coord.y + height)
    ctx.lineTo(coord.x + width, coord.y + height)
    ctx.lineTo(coord.x + width / 4 * 3, coord.y)
    ctx.lineTo(coord.x + width / 4, coord.y)
    ctx.closePath()
    ctx.stroke()
    return { ...coord, width, height }
}

const drawSelector = (ctx, x, y, width, height, pivotX, pivotY) => {
    // console.log(textSize)
    const coord = transformPivotXY(x, y, width, height, pivotX, pivotY)
    // ctx.strokeRect(coord.x, coord.y, rectWidth, rectHeight)
    // console.log(coord.x, coord.y, rectWidth, rectHeight)
    ctx.beginPath()
    ctx.moveTo(coord.x, coord.y)
    ctx.lineTo(coord.x + width, coord.y)
    ctx.lineTo(coord.x + width / 4 * 3, coord.y + height)
    ctx.lineTo(coord.x + width / 4, coord.y + height)
    ctx.closePath()
    ctx.stroke()
    // ctx.fillText(name, x + padding, y)
    return { ...coord, width, height }
}

const drawArrow = (ctx, startX, startY, endX, endY, head = 'arrow', state, bin) => {
    if (endX === undefined) endX = startX
    if (endY === undefined) endY = startY
    // line
    ctx.lineJoin = 'miter'
    ctx.lineWidth = state ? 3 : 1
    ctx.fillStyle = bin ? (state ? '#ff0000' : '#bbbbbb') : (state ? '#0000ff' : '#000000')
    ctx.strokeStyle = bin ? (state ? '#ff0000' : '#bbbbbb') : (state ? '#0000ff' : '#000000')
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    const arrowLength = 10
    const arrowWidth = 5
    const dotLength = 2.5

    // arrow
    if (!head) return

    // dot
    if (head === 'dot') {
        ctx.beginPath()
        ctx.arc(endX, endY, dotLength, 0, 2 * Math.PI)
        ctx.fill()
        return
    }

    ctx.beginPath()
    ctx.moveTo(endX, endY)
    if (endX > startX) { // -->
        ctx.lineTo(endX - arrowLength, endY - arrowWidth)
        ctx.lineTo(endX - arrowLength, endY + arrowWidth)
    } else if (startX > endX) { // <--
        ctx.lineTo(endX + arrowLength, endY - arrowWidth)
        ctx.lineTo(endX + arrowLength, endY + arrowWidth)
    } else if (endY > startY) { // v
        ctx.lineTo(endX + arrowWidth, endY - arrowLength)
        ctx.lineTo(endX - arrowWidth, endY - arrowLength)
    } else if (startY > endY) { // ^
        ctx.lineTo(endX + arrowWidth, endY + arrowLength)
        ctx.lineTo(endX - arrowWidth, endY + arrowLength)
    }
    // ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 1
    ctx.fillStyle = '#000000'
    ctx.strokeStyle = '#000000'
}

const drawControlArrow = (ctx, name, x, y, orientation, invert, pivotX, pivotY, state) => {
    const length = 20
    const width = 15
    const headProportionLength = 0.5
    const headProportionWidth = 0.6
    const rWidth = orientation ? width : length
    const rHeight = orientation ? length : width
    const coord = transformPivotXY(x, y, rWidth, rHeight, pivotX, pivotY)

    ctx.fillStyle = state ? '#ff0000' : '#dddddd'
    ctx.strokeStyle = '#000000'

    const headX = length * (1 - headProportionLength)
    const bodyTopY = width * (headProportionWidth / 2)
    const bodyBottomY = width - bodyTopY

    const f = x => invert ? length - x : x

    for (let i = 0; i < 2; i++) {
        ctx.beginPath()
        if (!orientation) {
            ctx.moveTo(coord.x + f(headX), coord.y)
            ctx.lineTo(coord.x + f(length), coord.y + width / 2)
            ctx.lineTo(coord.x + f(headX), coord.y + width)
            ctx.lineTo(coord.x + f(headX), coord.y + bodyBottomY)
            ctx.lineTo(coord.x + f(0), coord.y + bodyBottomY)
            ctx.lineTo(coord.x + f(0), coord.y + bodyTopY)
            ctx.lineTo(coord.x + f(headX), coord.y + bodyTopY)
        } else {
            ctx.moveTo(coord.x, coord.y + f(headX))
            ctx.lineTo(coord.x + width / 2, coord.y + f(length))
            ctx.lineTo(coord.x + width, coord.y + f(headX))
            ctx.lineTo(coord.x + bodyBottomY, coord.y + f(headX))
            ctx.lineTo(coord.x + bodyBottomY, coord.y + f(0))
            ctx.lineTo(coord.x + bodyTopY, coord.y + f(0))
            ctx.lineTo(coord.x + bodyTopY, coord.y + f(headX))
        }
        if (i === 0) {
            ctx.fill()
        } else {
            ctx.closePath()
            ctx.stroke()
        }
    }
    ctx.fillStyle = '#000000'
    ctx.font = '12px Roboto Mono'
    const textSize = measureText(ctx, name)
    const padding = 4
    if (!orientation) {
        ctx.fillText(name, coord.x + (invert ? rWidth + padding : (-textSize.width) - padding), coord.y + textSize.height + (rHeight - textSize.height) / 2 - (padding / 8))
    } else {
        ctx.fillText(name, coord.x + rWidth / 2 - textSize.width / 2 - (padding / 8), coord.y + (invert ? rHeight + padding + textSize.height : (-padding)))
    }
    return { ...coord, width: rWidth, height: rHeight }
}

const drawFlags = (ctx, x, y, width, height, pivotX, pivotY, flags, state) => {
    const coord = transformPivotXY(x, y, width, height, pivotX, pivotY)
    const flagWidth = width / flags.length
    flags.forEach((f, i) => {
        const x = coord.x + (flagWidth * i)
        const textSize = measureText(ctx, f)
        if (state[i]) {
            ctx.fillStyle = '#00ff00'
            ctx.fillRect(x, coord.y, flagWidth, height)
            ctx.fillStyle = '#000000'
        }
        ctx.strokeRect(x, coord.y, flagWidth, height)
        ctx.fillText(f, x + flagWidth / 2 - textSize.width / 2, coord.y + height / 2 + textSize.height / 2)
    })
    return { ...coord, width, height }
}

export default defineComponent({
    name: 'CanvasArchitecture',
    props: ['computer'],
    mounted () {
        const canvas = this.$refs.architecture
        const ctx = canvas.getContext('2d')

        const update = () => {
            // background
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)

            const margin = width * 0.1

            // draw
            const MDR = drawRegister(ctx, 'MDR', this.computer.controlUnit.LMD || this.computer.controlUnit.MR, margin, height - margin, 0, 2)
            const RAM = drawRegister(ctx, 'RAM', this.computer.controlUnit.MR || this.computer.controlUnit.MW, width / 2, height - margin, 1, 2)
            const MAR = drawRegister(ctx, 'MAR', this.computer.controlUnit.LMA, width - margin, height - margin, 2, 2)

            const marginFirstLineTop = height / 20

            const SEL = drawSelector(ctx, width - margin, MAR.y - marginFirstLineTop, MAR.width, height / 33, 2, 2)

            const marginSecondLineTop = marginFirstLineTop * 2

            const PC = drawRegister(ctx, 'PC', this.computer.controlUnit.IC || this.computer.controlUnit.LC, width - margin, SEL.y - marginSecondLineTop, 2, 2, SEL.width)
            const ACC = drawRegister(ctx, 'ACC', this.computer.controlUnit.LA, MDR.x, PC.y, 0, 0)
            const OUT = drawRegister(ctx, 'OUT', this.computer.controlUnit.LO, RAM.x, PC.y, 0, 0)

            const ALU = drawALU(ctx, ACC.x, ACC.y - (MDR.y - ACC.y - ACC.height), width / 4, height / 12, 0, 2)

            const RI = drawRegister(ctx, 'RI', this.computer.controlUnit.LI, PC.x - (PC.x - OUT.x - OUT.width) / 2, ALU.y + ALU.height / 2, 1, 1, OUT.width)

            const CON = drawRegister(ctx, 'CONTROL UNIT', false, margin, margin, 0, 0, width - margin * 2)

            const DEC = drawSelector(ctx, RI.x, RI.y - (RI.y - CON.y - CON.height) / 2, RI.width, height / 33, 0, 1)

            const FLA = drawFlags(ctx, ALU.x + ALU.width / 12 * 7, DEC.y, 50, 20, 1, 0, ['N', 'Z'], [this.computer.flags.N, this.computer.flags.Z])

            // MDR --> RAM
            drawArrow(ctx, MDR.x + MDR.width, MDR.y + MDR.height / 3, RAM.x, undefined, true, this.computer.controlUnit.MW)

            // MDR <-- RAM
            drawArrow(ctx, RAM.x, RAM.y + RAM.height / 3 * 2, MDR.x + MDR.width, undefined, true, this.computer.controlUnit.MR)

            // RAM <-- MAR
            drawArrow(ctx, MAR.x, MAR.y + MAR.height / 2, RAM.x + RAM.width, undefined, true, this.computer.controlUnit.MR || this.computer.controlUnit.MW)

            // SEL v MAR
            drawArrow(ctx, SEL.x + SEL.width / 2, SEL.y + SEL.height, undefined, MAR.y, true, this.computer.controlUnit.LMA)

            // PC v SEL
            drawArrow(ctx, PC.x + PC.width / 4 * 3, PC.y + PC.height, undefined, SEL.y, true, !this.computer.controlUnit.SA && this.computer.controlUnit.LMA)

            // MDR Bus
            const MDRBusX = MDR.x + MDR.width / 4 * 3
            const MDRBusY = SEL.y - marginSecondLineTop * 0.5
            const MDRBusEndX = width - margin - PC.width / 4 * 3
            const MDRBusRIX = RI.x + RI.width / 2
            const MDRBusALUY = RI.y + RI.height + height / 16
            const MDRBusALUX = ALU.x + ALU.width / 6 * 5
            const ULAState = this.computer.controlUnit.ADD || this.computer.controlUnit.AND || this.computer.controlUnit.OR || this.computer.controlUnit.LDA
            const firstState = ULAState || this.computer.controlUnit.LI || this.computer.controlUnit.LC || this.computer.controlUnit.SA
            drawArrow(ctx, MDRBusX, MDR.y, MDRBusX, MDRBusY, false, firstState)
            drawArrow(ctx, MDRBusX, MDRBusY, MDRBusRIX, MDRBusY, 'dot', firstState)
            drawArrow(ctx, MDRBusRIX, MDRBusY, MDRBusEndX, MDRBusY, 'dot', this.computer.controlUnit.LC || this.computer.controlUnit.SA)
            drawArrow(ctx, MDRBusEndX, MDRBusY, MDRBusEndX, PC.y + PC.height, true, this.computer.controlUnit.LC)
            drawArrow(ctx, MDRBusEndX, MDRBusY, MDRBusEndX, SEL.y, true, this.computer.controlUnit.SA)
            drawArrow(ctx, MDRBusRIX, MDRBusY, undefined, MDRBusALUY, 'dot', ULAState || this.computer.controlUnit.LI)
            drawArrow(ctx, MDRBusRIX, MDRBusALUY, undefined, RI.y + RI.height, true, this.computer.controlUnit.LI)
            drawArrow(ctx, MDRBusRIX, MDRBusALUY, MDRBusALUX, undefined, false, ULAState)
            drawArrow(ctx, MDRBusALUX, MDRBusALUY, undefined, ALU.y + ALU.height, true, ULAState)

            // ACC v MDR
            drawArrow(ctx, MDR.x + MDR.width / 4, ACC.y + ACC.height, undefined, MDR.y, true, this.computer.controlUnit.LMD)

            // ACC ^ ALU(x)
            drawArrow(ctx, ACC.x + ALU.width / 6, ACC.y, undefined, ALU.y + ALU.height, true, this.computer.controlUnit.ADD || this.computer.controlUnit.AND || this.computer.controlUnit.OR || this.computer.controlUnit.NOT)

            // ACC --> OUT
            drawArrow(ctx, ACC.x + ACC.width, ACC.y + ACC.height / 2, OUT.x, undefined, true, this.computer.controlUnit.LO)

            // ALU(s) to ACC
            drawArrow(ctx, ALU.x + ALU.width / 3, ALU.y, undefined, ALU.y - 15, false, this.computer.controlUnit.LA)
            drawArrow(ctx, ALU.x + ALU.width / 3, ALU.y - 15, ALU.x - 20, undefined, false, this.computer.controlUnit.LA)
            drawArrow(ctx, ALU.x - 20, ALU.y - 15, undefined, ACC.y + ACC.height / 2, false, this.computer.controlUnit.LA)
            drawArrow(ctx, ALU.x - 20, ACC.y + ACC.height / 2, ACC.x, undefined, true, this.computer.controlUnit.LA)

            // ALU to Flags
            drawArrow(ctx, ALU.x + ALU.width / 2, ALU.y, undefined, FLA.y + FLA.height, true, this.computer.controlUnit.LF)
            drawArrow(ctx, ALU.x + ALU.width / 3 * 2, ALU.y, undefined, FLA.y + FLA.height, true, this.computer.controlUnit.LF)

            // Flags to Control unit
            drawArrow(ctx, ALU.x + ALU.width / 2, FLA.y, undefined, CON.y + CON.height, true, this.computer.flags.N, true)
            drawArrow(ctx, ALU.x + ALU.width / 3 * 2, FLA.y, undefined, CON.y + CON.height, true, this.computer.flags.Z, true)

            // RI ^ Decoder
            drawArrow(ctx, RI.x + RI.width / 2, RI.y, DEC.x + DEC.width / 2, DEC.y + DEC.height, true, this.computer.controlUnit.LI)

            // Decoder to Control Unit
            const splitX = DEC.x + DEC.width / 2
            const splitY = CON.y + CON.height + (height / 16)
            const splitEndY = CON.y + CON.height
            drawArrow(ctx, splitX, DEC.y, undefined, splitY, 'dot', this.computer.controlUnit.LI)
            const inst = Object.keys(this.computer.instructions)
            // const ll = CON.x + CON.width / 3
            // const lr = CON.x + CON.width
            const s = 18
            inst.forEach((v, i) => {
                const stateInst = (v * 1) === this.computer.RI
                if (i === 0) {
                    drawArrow(ctx, splitX, splitY, undefined, splitEndY, true, stateInst, true)
                    return
                }
                drawArrow(ctx, splitX, splitY, splitX + Math.ceil(i / 2) * (i % 2 === 0 ? s : -s), undefined, i + 2 < inst.length ? 'dot' : false, stateInst, true)
                drawArrow(ctx, splitX + Math.ceil(i / 2) * (i % 2 === 0 ? s : -s), splitY, undefined, splitEndY, true, stateInst, true)
            })

            // LMD
            drawControlArrow(ctx, 'LMD', MDR.x + MDR.width / 2, MDR.y + MDR.height, 1, 1, 1, 0, this.computer.controlUnit.LMD)

            // MR
            drawControlArrow(ctx, 'MR', RAM.x + RAM.width / 4, RAM.y + RAM.height, 1, 1, 1, 0, this.computer.controlUnit.MR)

            // MW
            drawControlArrow(ctx, 'MW', RAM.x + RAM.width / 4 * 3, RAM.y + RAM.height, 1, 1, 1, 0, this.computer.controlUnit.MW)

            // LMA
            drawControlArrow(ctx, 'LMA', MAR.x + MAR.width / 2, MAR.y + MAR.height, 1, 1, 1, 0, this.computer.controlUnit.LMA)

            // IC
            drawControlArrow(ctx, 'IC', PC.x + PC.width / 4, PC.y, 1, 0, 1, 2, this.computer.controlUnit.IC)

            // LC
            drawControlArrow(ctx, 'LC', PC.x + PC.width / 4 * 3, PC.y, 1, 0, 1, 2, this.computer.controlUnit.LC)

            // LO
            drawControlArrow(ctx, 'LO', OUT.x + OUT.width / 2, OUT.y, 1, 0, 1, 2, this.computer.controlUnit.LO)

            // LI
            drawControlArrow(ctx, 'LI', RI.x + RI.width, RI.y + RI.height / 2, 0, 1, 0, 1, this.computer.controlUnit.LI)

            // LA
            drawControlArrow(ctx, 'LA', ACC.x + ACC.width / 4 * 3, ACC.y, 1, 0, 1, 2, this.computer.controlUnit.LA)

            // SA
            drawControlArrow(ctx, 'SA', SEL.x + SEL.width / 8 - 2, SEL.y + SEL.height / 2, 0, 0, 2, 1, this.computer.controlUnit.SA)

            // LF
            drawControlArrow(ctx, 'LF', FLA.x + FLA.width, FLA.y + FLA.height / 2, 0, 1, 0, 1, this.computer.controlUnit.LF)

            // ALU
            drawControlArrow(ctx, 'ADD', ALU.x + ALU.width / 4 * 3, ALU.y, 0, 1, 0, 1, this.computer.controlUnit.ADD)
            drawControlArrow(ctx, 'AND', ALU.x + ALU.width / 16 * 13, ALU.y + ALU.height / 4 * 1, 0, 1, 0, 1, this.computer.controlUnit.AND)
            drawControlArrow(ctx, 'OR', ALU.x + ALU.width / 8 * 7, ALU.y + ALU.height / 4 * 2, 0, 1, 0, 1, this.computer.controlUnit.OR)
            drawControlArrow(ctx, 'NOT', ALU.x + ALU.width / 16 * 15, ALU.y + ALU.height / 4 * 3, 0, 1, 0, 1, this.computer.controlUnit.NOT)
            drawControlArrow(ctx, 'LDA', ALU.x + ALU.width, ALU.y + ALU.height, 0, 1, 0, 1, this.computer.controlUnit.LDA)

            requestAnimationFrame(update)
        }
        update()
    }
})
</script>
