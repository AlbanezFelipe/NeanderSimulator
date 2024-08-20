<template>
    <q-dialog v-model="show">
        <q-card style="width: 350px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Carregar</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-file clearable color="orange" bottom-slots v-model="file" label="Arquivo" counter accept=".txt,.mem,.hex">
                    <template v-slot:prepend>
                        <q-icon name="attach_file" />
                    </template>

                    <template v-slot:hint>
                        Arquivos aceitos: mem, hex, txt
                    </template>
                </q-file>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="secondary" outline label="Cancelar" v-close-popup />
                <q-btn color="primary" icon="upload" label="Carregar" @click="load" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DialogLoad',
    data: () => ({
        show: false,
        file: null
    }),
    methods: {
        call () {
            this.show = true
        },
        load () {
            if (!this.file) return
            this.show = false
            console.log(this.file)
            this.$emit('load', this.file)
        }
    }
})

</script>
