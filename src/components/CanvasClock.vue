<template>
    <div class="row no-wrap">
        <div style="border: 2px solid #aaa9ae; box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.2); height: 154px;">
            <canvas ref="clock" width="400" height="150" style="width: 400px; height: 150px">
                Sorry, your browser does not support canvas.
            </canvas>
        </div>
        <div class="column full-width q-pl-sm">
            <!-- Clock Frequency -->
            <div class="column">
                <div class="row items-center">
                    <span class="q-mr-sm">Clock Frequency (ms) {{ clock.frequency }}ms {{ (1000 / clock.frequency).toFixed(3) }}Hz</span>
                    <q-badge rounded>
                        <span class="help">?</span>
                        <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                            Duration in milliseconds of clock tick
                        </q-tooltip>
                    </q-badge>
                </div>
                <q-slider @update:model-value="$emit('update:frequency', $event)" :model-value="clock.frequency" :min="0" :max="2500" :step="25" label />
            </div>
            <div class="column">
                <div class="row items-center">
                    <span class="q-mr-sm">time/div (ms) {{ timeDiv }}</span>
                    <q-badge rounded>
                        <span class="help">?</span>
                        <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                            Duration in milliseconds of clock tick
                        </q-tooltip>
                    </q-badge>
                </div>
                <q-slider v-model="timeDiv" :min="0" :max="5000" :step="5" label />
            </div>
            <div class="column">
                <div class="row items-center">
                    <span class="q-mr-sm">divs {{ divs }}</span>
                    <q-badge rounded>
                        <span class="help">?</span>
                        <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                            Duration in milliseconds of clock tick
                        </q-tooltip>
                    </q-badge>
                </div>
                <q-slider v-model="divs" :min="1" :max="16" :step="1" label />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

const width = 400
const height = 150
const yHigh = height * 0.2 // 0.25
const yLow = height * 0.8 // 0.75
// const history = [{ state: 1, length: 1002 }, { state: 0, length: 781 }, { state: 1, length: 1000 }, { state: 0, length: 751 }, { state: 1, length: 1000 }]
// const state = 0
// const ref = new Date()
// const now = new Date()
// const unit = 10000

export default defineComponent({
    name: 'CanvasArchitecture',
    data: () => ({
        timeDiv: 1000,
        divs: 8
    }),
    props: ['clock'],
    mounted () {
        const canvas = this.$refs.clock
        const ctx = canvas.getContext('2d')

        const stateHeight = s => s ? yHigh : yLow

        const update = () => {
            // background
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, width, height)

            ctx.lineJoin = 'miter'
            ctx.lineWidth = 2
            ctx.strokeStyle = 'rgb(50, 50, 50)'
            // ctx.shadowBlur = 0

            const divWidth = width / this.divs

            for (let i = 1; i < this.divs; i++) {
                const divX = i * divWidth
                ctx.beginPath()
                ctx.moveTo(divX, 0)
                ctx.lineTo(divX, height)
                ctx.stroke()
            }

            [height / 2, yHigh, yLow].forEach(y => {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            })

            // clock
            ctx.lineJoin = 'miter'
            ctx.lineWidth = 5
            ctx.strokeStyle = 'rgb(3, 160, 98)'
            // ctx.shadowColor = '#00ff00'
            // ctx.shadowOffsetX = 0
            // ctx.shadowOffsetY = 0
            // ctx.shadowBlur = 10

            ctx.beginPath()

            let timeX = width
            const now = new Date()

            const s1 = stateHeight(this.clock.state)
            ctx.moveTo(width, s1)
            timeX = timeX - (now - this.clock.lastPoint) * divWidth / this.timeDiv
            ctx.lineTo(timeX, s1)

            this.clock.history.slice().reverse().forEach(v => {
                const s = stateHeight(v.state)
                ctx.lineTo(timeX, s)
                timeX = timeX - v.length * divWidth / this.timeDiv
                ctx.lineTo(timeX, s)
            })
            ctx.stroke()
            //
            requestAnimationFrame(update)
        }
        update()
    }
})
</script>
