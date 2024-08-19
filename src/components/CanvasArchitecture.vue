<template>
    <canvas ref="architecture" width="400" height="400">
        Sorry, your browser does not support canvas.
    </canvas>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CanvasArchitecture',
    props: ['computer'],
    mounted () {
        const canvas = this.$refs.architecture
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, 400, 400)
        console.log(ctx)
    }
})
</script>
