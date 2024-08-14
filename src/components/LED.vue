<template>
    <div :class="'led-' + (state ? 'on' : 'off')" :style="`width: ${size}px; height: ${size}px`"></div>
</template>

<style lang="stylus">

    display_color = #2dd82e

    .led-on,
    .led-off
        border-radius 50%
        background-color display_color
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
        }
    }
})
</script>
