<template>
    <canvas ref="architecture" width="400" height="800">
        Sorry, your browser does not support canvas.
    </canvas>
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

const drawRegister = (ctx, name, x, y, pivotX, pivotY) => {
    ctx.fillStyle = 'black'
    ctx.font = '22px serif'
    const padding = 5
    const textSize = measureText(ctx, name)
    // console.log(textSize)
    const rectWidth = textSize.width + padding * 2
    const rectHeight = textSize.height + padding * 2
    const coord = transformPivotXY(x, y, rectWidth, rectHeight, pivotX, pivotY)
    ctx.strokeRect(coord.x, coord.y, rectWidth, rectHeight)
    // console.log(coord.x, coord.y, rectWidth, rectHeight)
    ctx.fillText(name, coord.x + padding, coord.y + (textSize.height) + padding)
    // ctx.fillText(name, x + padding, y)
    return { ...coord, width: rectWidth, height: rectHeight }
}

const drawALU = (ctx, x, y, pivotX, pivotY) => {
    //
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

const drawArrow = (ctx, startX, startY, endX, endY) => {
    // line
    ctx.lineJoin = 'miter'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    const arrowLength = 10
    const arrowWidth = 5

    // arrow
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
            const MDR = drawRegister(ctx, 'MDR', margin, height - margin, 0, 0)
            const RAM = drawRegister(ctx, 'RAM', width / 2, height - margin, 1, 0)
            const MAR = drawRegister(ctx, 'MAR', width - margin, height - margin, 2, 0)

            drawRegister(ctx, 'PC', width - margin, height - margin - 100, 2, 0)
            const SEL = drawSelector(ctx, width - margin, height - margin - 50, MAR.width, 20, 2, 0)

            // MDR --> RAM
            drawArrow(ctx, MDR.x + MDR.width, MDR.y + MDR.height / 3, RAM.x, RAM.y + RAM.height / 3)

            // MDR <-- RAM
            drawArrow(ctx, RAM.x, RAM.y + RAM.height / 3 * 2, MDR.x + MDR.width, MDR.y + MDR.height / 3 * 2)

            // RAM <-- MAR
            drawArrow(ctx, MAR.x, MAR.y + MAR.height / 2, RAM.x + RAM.width, RAM.y + RAM.height / 2)

            // SEL v MAR
            drawArrow(ctx, SEL.x + SEL.width / 2, SEL.y + SEL.height, MAR.x + MAR.width / 2, MAR.y)

            drawALU()

            requestAnimationFrame(update)
        }
        update()
    }
})
</script>
