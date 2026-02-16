<template>
    <div class="column items-center">
        <div class="bg-dark q-px-sm q-py-sm silver-border" style="width: fit-content">
            <div class="relative-position">
                <span class="segment-on absolute-center">{{ print }}</span>
                <!--span class="segment-off absolute-center">{{ placeholder }}</span>-->
                <span class="segment-off">{{ placeholder }}</span>
            </div>
            <EditNumber :value="value" @update="$emit('update', $event)"></EditNumber>
        </div>
        <div class="row">
            <div class="q-mt-xs" v-for="(b, i) in ([...(value >>> 0).toString(2).padStart(8, '0')].map(n => !!(n * 1)))" :key="'acc-' + i">
                <LED :state="b" />
            </div>
        </div>
    </div>
</template>

<style lang="stylus">

    @import '../css/utils.styl';

    display_color = #2dd82e

    .segment-on,
    .segment-off
        font-family 'Seven Segment'
        color display_color
        font-size 24px
        font-weight 400
        line-height 1
        display inline-block
        vertical-align middle
        text-wrap nowrap

    .segment-on
        width 100%
        text-align right
        z-index 1

    .segment-off
        opacity 0.25
        no-select()
        z-index 0

    .silver-border
        border 2px solid #aaa9ae
        box-shadow 1px 1px 2px 0px rgba(0, 0, 0, 0.2)

</style>

<script>
import { defineComponent } from 'vue'
import LED from 'components/LED.vue'
import EditNumber from 'components/EditNumber.vue'
import { complement2 } from '../utils.js'

export default defineComponent({
    name: 'DigitalSegment',
    components: { LED, EditNumber },
    props: {
        value: {
            type: Number,
            required: true
        },
        is2s: {
            type: Boolean,
            default: false
        },
        isHex: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        placeholder () {
            return '8'.repeat(3 + (+this.is2s) - (+this.isHex))
        },
        print () {
            return (this.is2s ? complement2(this.value) : this.value).toString(this.isHex ? 16 : 10)
        }
    }
})
</script>
