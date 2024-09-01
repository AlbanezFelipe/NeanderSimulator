<template>
    <div :class="`led-${state ? 'on' : 'off'} ${color}`" :style="`width: ${size}px; height: ${size}px`"></div>
</template>

<style lang="stylus">

    red_color = #ff0000
    green_color = #2dd82e
    blue_color = #0066a3

    .red
        background-color red_color

    .green
        background-color green_color

    .blue
        background-color blue_color

    .led-on,
    .led-off
        border-radius 50%
        margin 0 1px
        border 1px solid black

    .led-off
        opacity 0.25
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LED',
    props: {
        state: {
            type: Boolean,
            required: true
        },
        size: {
            type: Number,
            default: 8
        },
        color: {
            type: String,
            default: 'green'
        }
    }
})
</script>
