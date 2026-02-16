<template>
    <q-popup-edit :model-value="value" @update:model-value="$emit('update', $event)" title="Definir" auto-save buttons label-set="Salvar" label-cancel="Cancelar" v-slot="scope" @before-show="resync(value)">
        <q-select label="Mnemônico" v-if="instructions.length" v-model="scope.value" @update:model-value="resync($event)" :options="instructions" dense autofocus emit-value map-options style="margin-bottom: 20px" />
        <q-input type="number" label="Número Decimal" min="0" max="255" :model-value="valBuffer" @update:model-value="updateVal($event, scope)" @blur="resync(scope.value)" dense autofocus :rules="[v => numberValidation(v) || 'Número Válido de 0 até 255']" />
        <q-input type="text" label="Número Hexadecimal" :model-value="hexBuffer" @update:model-value="updateHex($event, scope)" @blur="resync(scope.value)" dense autofocus :rules="[(v) => numberValidation(Number('0x' + v)) || 'Número Válido de 0 até ff']" />
        <q-input type="text" label="Número Binário" :model-value="binBuffer" @update:model-value="updateBin($event, scope)" @blur="resync(scope.value)" dense autofocus :rules="[(v) => numberValidation(Number('0b' + v)) || 'Número Válido de 00000000 até 11111111']" />
    </q-popup-edit>
</template>

<script>
import { defineComponent } from 'vue'
import { numberValidation } from '../utils'

export default defineComponent({
    name: 'EditNumber',
    setup () {
        return { numberValidation }
    },
    data: () => ({
        valBuffer: '',
        hexBuffer: '',
        binBuffer: ''
    }),
    props: {
        value: {
            type: Number,
            required: true
        },
        instructions: {
            type: Array,
            default: () => []
        }
    },
    created () {
        this.resync(this.value)
    },
    methods: {
        resync (v) {
            if (numberValidation(v)) {
                this.resyncVal(v)
                this.resyncHex(v)
                this.resyncBin(v)
            }
        },
        resyncVal (v) {
            this.valBuffer = v?.toString()
        },
        resyncHex (v) {
            this.hexBuffer = v?.toString(16)?.padStart(2, '0')
        },
        resyncBin (v) {
            this.binBuffer = (v >>> 0)?.toString(2)?.padStart(8, '0')
        },
        updateVal (v, scope) {
            this.valBuffer = v
            const u = Number(v)
            if (numberValidation(u)) {
                scope.value = u
                this.resyncHex(u)
                this.resyncBin(u)
            }
        },
        updateHex (v, scope) {
            this.hexBuffer = v
            const u = Number('0x' + v)
            if (numberValidation(u)) {
                scope.value = u
                this.resyncVal(u)
                this.resyncBin(u)
            }
        },
        updateBin (v, scope) {
            this.binBuffer = v
            const u = Number('0b' + v)
            if (numberValidation(u)) {
                scope.value = u
                this.resyncVal(u)
                this.resyncHex(u)
            }
        }
    }
})
</script>
