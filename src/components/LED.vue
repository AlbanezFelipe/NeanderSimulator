<template>
    <div :class="`led-${state ? 'on' : 'off'} ${color}`" :style="`width: ${size}px; height: ${size}px`"></div>
</template>

<style lang="stylus">

    red_color = #ef0307
    green_color = #2dd82e
    blue_color = #0066a3

    .red
        background radial-gradient(farthest-corner at 32% 25%, #ddd 0%, red_color 50%)

    .green
        background radial-gradient(farthest-corner at 32% 25%, #fff 0%, green_color 50%)

    .blue
        background radial-gradient(farthest-corner at 32% 25%, #fff 0%, blue_color 50%)

    .led-on,
    .led-off
        border-radius 50%
        margin 0 1px
        border 1px solid black

    .led-off
        background radial-gradient(farthest-corner at 32% 25%, #ccc 0%, #636363 50%)
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
