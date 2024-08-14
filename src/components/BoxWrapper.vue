<template>
    <div class="relative-position q-mt-md q-py-md q-px-md" style="border: 1px solid black; border-radius: 16px">
        <span class="title-box">{{ title }}</span>
        <slot></slot>
    </div>
</template>

<style lang="stylus">

.title-box
    position absolute
    top -6px
    left 18px
    background-color white
    line-height 0.75
    padding 0 8px
    border-radius 16px

</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'BoxWrapper',
    props: {
        title: {
            type: String,
            required: true
        }
    }
})
</script>
