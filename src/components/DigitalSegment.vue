<template>
    <div class="column items-center">
        <div class="bg-dark q-px-sm q-py-xs silver-border" style="width: fit-content">
            <div class="relative-position">
                <span class="segment-on absolute-center">{{ value }}</span>
                <span class="segment-off absolute-center">888</span>
                <span class="segment-off" style="opacity: 0">888</span>
            </div>
            <q-popup-edit @update:model-value="$emit('update', $event)" :model-value="value" title="Update data" buttons v-slot="scope">
                <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
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
        font-size 36px
        font-weight 400
        line-height 1

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

export default defineComponent({
    name: 'DigitalSegment',
    components: { LED },
    props: {
        value: {
            type: Number,
            required: true
        }
    }
})
</script>
