<template>
    <div class="col-sm-4 col-md-2 col-lg-2" style="overflow: hidden">
        <q-btn @click="$emit('action-click')" class="full-width full-height" :color="color">
            <div class="column flex-center q-py-xs" style="overflow: hidden">
                <q-icon :name="icon" />
                <span class="text-ellipsis">{{ label }}</span>
                <span class="text-ellipsis" style="font-size: 12px" v-if="subLabel">({{ subLabel }})</span>
            </div>
        </q-btn>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ControlButton',
    props: {
        color: { type: String, default: 'primary' },
        icon: { type: String, required: true },
        label: { type: String, required: true },
        subLabel: { type: String, required: false }
    }
})
</script>
