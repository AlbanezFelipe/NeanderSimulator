<template>
    <q-btn-dropdown flat color="white" dense :label="bases[value]">
        <q-list>
            <q-item v-if="!noBin" clickable v-close-popup @click="$emit('update:value', 'binary')">
                <q-item-section>
                    <q-item-label>Binário 0..1</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('update:value', 'decimal')">
                <q-item-section>
                    <q-item-label>Decimal 0..9</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('update:value', 'hexadecimal')">
                <q-item-section>
                    <q-item-label>Hexadecimal 0..F</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>

<script>
import { defineComponent } from 'vue'

const bases = {
    binary: '0..1',
    decimal: '0..9',
    hexadecimal: '0..F'
}

export default defineComponent({
    name: 'BaseDropdown',
    props: {
        value: { type: String, required: true },
        noBin: { type: Boolean, default: false }
    },
    setup () {
        return { bases }
    }
})
</script>
