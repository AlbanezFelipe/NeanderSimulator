<template>
    <q-dialog v-model="show">
        <q-card style="width: 350px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Sobre</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <span v-if="name" class="block q-mt-sm">sobre</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="secondary" outline label="Fechar" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DialogExamples',
    data: () => ({
        show: false
    }),
    // props: {}
    methods: {
        call () {
            this.show = true
        }
    }
})

</script>
