<template>
    <q-dialog v-model="show">
        <q-card style="width: 600px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Carregar um Exemplo</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-select v-model="value" :options="examples" label="Exemplo" emit-value map-options />
                <span class="block q-pt-md">Carregue um exemplo para aprender como o Neander funciona</span>
                <span style="color: rgba(0, 0, 0, 0.54); font-size: 12px" class="block q-pt-sm"><q-icon class="q-pr-xs" style="padding-bottom: 1px" name="o_info" />Ao carregar um exemplo qualquer progresso não salvo será perdido.</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="secondary" outline label="Fechar" v-close-popup />
                <q-btn color="primary" icon="download" label="Carregar" @click="load" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

const examples = [
    { label: 'Somar (8 + 4)', value: 'sum' },
    { label: 'Subtrair (12 - 4)', value: 'sub' },
    { label: 'Multiplicação (5 * 3)', value: 'mul' },
    { label: 'Sequência Fibonacci', value: 'fib' }
]

export default defineComponent({
    name: 'DialogExamples',
    data: () => ({
        show: false,
        value: 'sum'
    }),
    setup () {
        return { examples }
    },
    // props: {}
    methods: {
        call () {
            this.show = true
        },
        load () {
            if (!this.value) return
            this.show = false
            this.$emit('load', this.value)
        }
    }
})

</script>
