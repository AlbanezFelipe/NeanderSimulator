<template>
    <q-page class="flex justify-around">
        <div class="row full-width">

            <!-- RAM -->
            <div class="column">
                <span>Simulador</span>
                <q-table
                    class="sticky-table"
                    :rows="ramRows"
                    :columns="columns"
                    :rows-per-page-options="[0]"
                >
                    <template v-slot:body-cell-p="props">
                        <q-td :props="props">
                            <q-icon v-if="props.value" name="east" color="black" size="24px"/>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-data="props">
                        <q-td :props="props">
                            {{ props.row.data }}
                            <q-popup-edit v-model="ram[props.row.address]" title="Update data" buttons v-slot="scope">
                                <q-input type="number" v-model="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                    </template>

                </q-table>
            </div>

            <!-- Machine -->
            <div class="column q-mx-lg" style="border: 1px solid black">
                <span class="bg-primary text-white q-px-sm q-py-sm">Computador</span>
                <div class="column q-pa-sm">

                    <!-- Architecture -->
                    <div class="row items-center q-mb-sm">
                        <q-select class="full-width" outlined v-model="arch" :options="['Neander']" label="Arquitetura" />
                    </div>

                    <!-- Accumulator -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>Acumulador (ACC)</span>
                        <DigitalSegment :value="acc" />
                    </div>

                    <!-- Program Counter -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>Contador de Programa (PC)</span>
                        <DigitalSegment :value="pc" />
                    </div>

                    <!-- Control Bus -->
                    <BoxWrapper title="Barramento de Controle">
                        <div class="row justify-around">
                            <div class="row">
                                <span class="q-mr-sm">N</span>
                                <LED :state="this.acc < 0" :size="24" />
                            </div>
                            <div class="row">
                                <span class="q-mr-sm">Z</span>
                                <LED :state="this.acc === 0" :size="24" />
                            </div>
                        </div>
                    </BoxWrapper>

                    <!-- Simulation -->
                    <BoxWrapper title="Simulação">
                        <div class="row">
                            <div class="row items-center">
                                <span class="q-mr-sm">Clock Frequency (ms) {{ f }}</span>
                                <q-badge rounded>
                                    <span class="help">?</span>
                                    <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                                        Duration in milliseconds of clock tick
                                    </q-tooltip>
                                </q-badge>
                            </div>
                            <q-slider v-model="clock" :min="0" :max="5000" :step="50" label />
                        </div>
                    </BoxWrapper>
                </div>
            </div>
            <div class="column">
                <span>Diagrama</span>
                <!-- Canvas -->
                <img alt="Quasar logo"
                    src="~assets/diagram.png"
                    style="width: 600px; height: auto"
                >
            </div>
        </div>
    </q-page>
</template>

<style lang="stylus">

.sticky-table
    height: 800px

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
        background-color #00b4ff

    thead tr th
        position: sticky
        z-index: 1

    thead tr:first-child th
        top: 0

    &.q-table--loading thead tr:last-child th
        top: 48px

    tbody
        scroll-margin-top: 48px

</style>

<script>
import { defineComponent } from 'vue'
import DigitalSegment from 'components/DigitalSegment.vue'
import BoxWrapper from 'components/BoxWrapper.vue'
import LED from 'components/LED.vue'

const columns = [
    {
        name: 'p',
        label: 'P.',
        align: 'left',
        field: row => row.p,
        format: val => !!val
    },
    {
        name: 'data',
        label: 'Data',
        align: 'left',
        field: row => row.data,
        format: val => `${val}`
    },
    {
        name: 'address',
        label: 'Endereço',
        align: 'left',
        field: row => row.address,
        format: val => `${val}`
    },
    {
        name: 'mnemonic',
        label: 'Mnemônico',
        align: 'left',
        field: row => row.mnemonic,
        format: val => `${val}`
    }
]

const mnemonics = n => ({
    16: 'STA',
    32: 'LDA',
    48: 'ADD',
    64: 'OR',
    80: 'AND',
    96: 'NOT',
    128: 'JMP',
    144: 'JN',
    160: 'JZ',
    240: 'HLT'
})[n] || 'NOP'

export default defineComponent({
    name: 'IndexPage',
    components: { DigitalSegment, BoxWrapper, LED },
    data: () => ({
        arch: 'Neander',
        ram: new Array(256).fill(0),
        // registers
        pc: 0,
        acc: 0,
        ri: 0,
        // sim
        clock: 1000
    }),
    computed: {
        ramRows () {
            return this.ram.map((d, i) => ({ data: d, address: i, p: i === this.pc, mnemonic: mnemonics(d) }))
        }
    },
    setup () {
        return { columns }
    }
})
</script>
