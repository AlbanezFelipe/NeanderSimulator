<template>
    <q-dialog v-model="show">
        <q-card style="width: 600px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Limpar Memória</div>
            </q-card-section>

            <q-card-section class="q-py-md">
                <span class="block">Você tem certeza que deseja resetar a memória de programa?</span>
                <span style="color: rgba(0, 0, 0, 0.54); font-size: 12px" class="block q-pt-sm"><q-icon class="q-pr-xs" style="padding-bottom: 1px" name="o_info" />Todos os valores são definidos como zero e qualquer progresso não salvo será perdido.</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="secondary" outline label="Cancelar" v-close-popup />
                <q-btn color="negative" icon="clear" label="Limpar" @click="clear" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DialogClear',
    data: () => ({
        show: false
    }),
    // props: {}
    methods: {
        call () {
            this.show = true
        },
        clear () {
            this.show = false
            this.$emit('clear')
        }
    }
})

</script>
