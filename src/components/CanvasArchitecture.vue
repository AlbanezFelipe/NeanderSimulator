<template>
    <div style="border: 1px solid red">
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

const drawArrow = (ctx, startX, startY, endX, endY, type = 'arrow', state) => {
    if (endX === undefined) endX = startX
    if (endY === undefined) endY = startY
    // line
    ctx.lineJoin = 'miter'
    ctx.lineWidth = 1
    // ctx.fillStyle = !state ? '#ffff00' : '#cccccc'
    // ctx.strokeStyle = !state ? '#ffff00' : '#cccccc'
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    const arrowLength = 10
    const arrowWidth = 5
    const dotLength = 2.5

    // arrow
    if (!type) return

    // dot
    if (type === 'dot') {
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
}

const drawFlags = (ctx, x, y, width, height, pivotX, pivotY, flags) => {
    const coord = transformPivotXY(x, y, width, height, pivotX, pivotY)
    const flagWidth = width / flags.length
    flags.forEach((f, i) => {
        const x = coord.x + (flagWidth * i)
        const textSize = measureText(ctx, f)
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
            const MDR = drawRegister(ctx, 'MDR', this.computer.controlUnit.LMD, margin, height - margin, 0, 2)
            const RAM = drawRegister(ctx, 'RAM', this.computer.controlUnit.MR || this.computer.controlUnit.MW, width / 2, height - margin, 1, 2)
            const MAR = drawRegister(ctx, 'MAR', this.computer.controlUnit.LMA, width - margin, height - margin, 2, 2)

            const marginFirstLineTop = height / 20

            const SEL = drawSelector(ctx, width - margin, MAR.y - marginFirstLineTop, MAR.width, height / 33, 2, 2)

            const marginSecondLineTop = marginFirstLineTop * 2

            const PC = drawRegister(ctx, 'PC', this.computer.controlUnit.IC || this.computer.controlUnit.LC, width - margin, SEL.y - marginSecondLineTop, 2, 2, SEL.width)
            const ACC = drawRegister(ctx, 'ACC', this.computer.controlUnit.LA, MDR.x, PC.y, 0, 0)
            const OUT = drawRegister(ctx, 'OUT', this.computer.controlUnit.LO, RAM.x, PC.y, 0, 0)

            const ALU = drawALU(ctx, ACC.x, ACC.y - (MDR.y - ACC.y - ACC.height), width / 4, height / 16, 0, 2)

            const RI = drawRegister(ctx, 'RI', this.computer.controlUnit.LI, PC.x - (PC.x - OUT.x - OUT.width) / 2, ALU.y + ALU.height / 2, 1, 1, OUT.width)

            const CON = drawRegister(ctx, 'CONTROL UNIT', false, margin, margin, 0, 0, width - margin * 2)

            const DEC = drawSelector(ctx, RI.x, RI.y - (RI.y - CON.y - CON.height) / 2, RI.width, height / 33, 0, 1)

            const FLA = drawFlags(ctx, ALU.x + ALU.width / 12 * 7, DEC.y, 50, 20, 1, 0, ['N', 'Z'])

            // MDR --> RAM
            drawArrow(ctx, MDR.x + MDR.width, MDR.y + MDR.height / 3, RAM.x, RAM.y + RAM.height / 3)

            // MDR <-- RAM
            drawArrow(ctx, RAM.x, RAM.y + RAM.height / 3 * 2, MDR.x + MDR.width, MDR.y + MDR.height / 3 * 2)

            // RAM <-- MAR
            drawArrow(ctx, MAR.x, MAR.y + MAR.height / 2, RAM.x + RAM.width, RAM.y + RAM.height / 2)

            // SEL v MAR
            drawArrow(ctx, SEL.x + SEL.width / 2, SEL.y + SEL.height, MAR.x + MAR.width / 2, MAR.y)

            // PC v SEL
            drawArrow(ctx, PC.x + PC.width / 4 * 3, PC.y + PC.height, PC.x + PC.width / 4 * 3, SEL.y)

            // MDR Bus
            const MDRBusX = MDR.x + MDR.width / 4 * 3
            const MDRBusY = SEL.y - marginSecondLineTop * 0.5
            const MDRBusEndX = width - margin - PC.width / 4 * 3
            const MDRBusRIX = RI.x + RI.width / 2
            const MDRBusALUY = RI.y + RI.height + 50
            const MDRBusALUX = ALU.x + ALU.width / 4 * 3
            drawArrow(ctx, MDRBusX, MDR.y, MDRBusX, MDRBusY, false)
            drawArrow(ctx, MDRBusX, MDRBusY, MDRBusRIX, MDRBusY, 'dot')
            drawArrow(ctx, MDRBusRIX, MDRBusY, MDRBusEndX, MDRBusY, 'dot')
            drawArrow(ctx, MDRBusEndX, MDRBusY, MDRBusEndX, PC.y + PC.height)
            drawArrow(ctx, MDRBusEndX, MDRBusY, MDRBusEndX, SEL.y)
            drawArrow(ctx, MDRBusRIX, MDRBusY, undefined, MDRBusALUY, 'dot')
            drawArrow(ctx, MDRBusRIX, MDRBusALUY, undefined, RI.y + RI.height)
            drawArrow(ctx, MDRBusRIX, MDRBusALUY, MDRBusALUX, undefined, false)
            drawArrow(ctx, MDRBusALUX, MDRBusALUY, undefined, ALU.y + ALU.height)

            // MDR ^ ACC
            drawArrow(ctx, MDR.x + MDR.width / 4, MDR.y, MDR.x + MDR.width / 4, ACC.y + ACC.height)

            // ACC ^ ALU(x)
            drawArrow(ctx, ACC.x + ALU.width / 6, ACC.y, ACC.x + ALU.width / 6, ALU.y + ALU.height)

            // ACC --> OUT
            drawArrow(ctx, ACC.x + ACC.width, ACC.y + ACC.height / 2, OUT.x)

            // ALU(s) to ACC
            drawArrow(ctx, ALU.x + ALU.width / 3, ALU.y, undefined, ALU.y - 25, false)
            drawArrow(ctx, ALU.x + ALU.width / 3, ALU.y - 25, ALU.x - 25, undefined, false)
            drawArrow(ctx, ALU.x - 25, ALU.y - 25, undefined, ACC.y + ACC.height / 2, false)
            drawArrow(ctx, ALU.x - 25, ACC.y + ACC.height / 2, ACC.x)

            // ALU to Flags
            drawArrow(ctx, ALU.x + ALU.width / 2, ALU.y, undefined, FLA.y + FLA.height)
            drawArrow(ctx, ALU.x + ALU.width / 3 * 2, ALU.y, undefined, FLA.y + FLA.height)

            // Flags to Control unit
            drawArrow(ctx, ALU.x + ALU.width / 2, FLA.y, undefined, CON.y + CON.height)
            drawArrow(ctx, ALU.x + ALU.width / 3 * 2, FLA.y, undefined, CON.y + CON.height)

            // RI ^ Decoder
            drawArrow(ctx, RI.x + RI.width / 2, RI.y, DEC.x + DEC.width / 2, DEC.y + DEC.height)

            // Decoder to Control Unit
            const splitX = DEC.x + DEC.width / 2
            const splitY = DEC.y - 80
            const splitEndY = CON.y + CON.height
            drawArrow(ctx, splitX, DEC.y, undefined, splitY, 'dot')
            const inst = ['NOP', 'STA', 'LDA', 'ADD', 'AND', 'OR', 'NOT', 'JMP', 'JZ', 'JN', 'OUT', 'HLT']
            // const ll = CON.x + CON.width / 3
            // const lr = CON.x + CON.width
            const s = 18
            inst.forEach((v, i) => {
                if (i === 0) {
                    drawArrow(ctx, splitX, splitY, undefined, splitEndY)
                    return
                }
                drawArrow(ctx, splitX + (Math.ceil(i / 2) - 1) * (i % 2 === 0 ? s : -s), splitY, splitX + Math.ceil(i / 2) * (i % 2 === 0 ? s : -s), undefined, i + 2 < inst.length ? 'dot' : false)
                drawArrow(ctx, splitX + Math.ceil(i / 2) * (i % 2 === 0 ? s : -s), splitY, undefined, splitEndY)
            })

            requestAnimationFrame(update)
        }
        update()
    }
})
</script>
