<template>
    <q-dialog v-model="show">
        <q-card style="width: 350px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Salvar Como</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-select v-model="format" :options="formats" label="Formato" emit-value map-options />
                <q-input label="Nome do Arquivo" v-model="name" />
                <span v-if="name" class="block q-mt-sm"><b>Salvar como:</b> {{ name }}.{{ format }}</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="secondary" outline label="Cancelar" v-close-popup />
                <q-btn color="negative" icon="save" label="Salvar" @click="save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

const formats = [
    { label: 'mem (compatível com WNeander)', value: 'mem' },
    { label: 'hexmem (formato hexdump)', value: 'hex' },
    { label: 'texto', value: 'txt' }
]

export default defineComponent({
    name: 'DialogSave',
    data: () => ({
        show: false,
        name: '',
        format: 'mem'
    }),
    setup () {
        return { formats }
    },
    // props: {}
    methods: {
        call () {
            this.show = true
        },
        save () {
            if (!this.name) return
            this.show = false
            this.$emit('save', this.name, this.format)
        }
    }
})

</script>
