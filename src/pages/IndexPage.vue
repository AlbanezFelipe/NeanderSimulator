<template>
    <q-page class="flex justify-around">
        <div class="row justify-center full-width no-wrap q-py-md">

            <!-- RAM -->
            <div class="column w">
                <div class="row justify-between items-center bg-primary text-white q-py-sm q-px-sm">
                    <span class="title-header">Programa</span>
                    <div>
                        <q-btn-dropdown flat color="white" dense label="0..9">
                            <q-list>
                                <q-item clickable v-close-popup @click="onItemClick">
                                    <q-item-section>
                                        <q-item-label>binary 0..1</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-close-popup @click="onItemClick">
                                    <q-item-section>
                                        <q-item-label>decimal 0..9</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-close-popup @click="onItemClick">
                                    <q-item-section>
                                        <q-item-label>hexadecimal 0..F</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>
                        <q-btn size="sm" flat padding="xs" color="white" icon="remove" />
                    </div>
                </div>
                <q-table
                    class="sticky-table"
                    :rows="ramRows"
                    :columns="columns"
                    :rows-per-page-options="[0]"
                    hide-bottom
                >
                    <template v-slot:body-cell-p="props">
                        <q-td :props="props">
                            <q-icon v-if="props.value" name="east" color="black" size="24px"/>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-data="props">
                        <q-td :props="props">
                            {{ props.row.data }}
                            <q-popup-edit v-model="computer.RAM[props.row.address]" title="Update data" buttons v-slot="scope">
                                <q-input type="number" v-model.number="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                    </template>

                </q-table>
            </div>

            <!-- Machine -->
            <div class="column w q-ml-lg">
                <span class="bg-primary text-white q-px-sm q-py-sm title-header">Computador</span>
                <div class="column q-pa-sm">

                    <!-- Architecture -->
                    <div class="row items-center q-mb-sm">
                        <q-select class="full-width" outlined v-model="arch" :options="['Neander', 'Ahmes']" label="Arquitetura" />
                    </div>

                    <!-- Accumulator -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>Acumulador (ACC)</span>
                        <DigitalSegment @update="computer.ACC = $event" :value="computer.ACC" />
                    </div>

                    <!-- Program Counter -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>Contador de Programa (PC)</span>
                        <DigitalSegment @update="computer.PC = $event" :value="computer.PC" />
                    </div>

                    <!-- Control Bus -->
                    <BoxWrapper title="Barramento de Controle">
                        <div class="row justify-around">
                            <div class="row" v-for="c in control" :key="'control-' + c.key">
                                <span class="q-mr-sm">{{ c.key }}</span>
                                <LED :state="c.state" :size="24" />
                            </div>
                        </div>
                    </BoxWrapper>

                    <!-- Simulation -->
                    <BoxWrapper title="Simulação">
                        <!-- Actions -->
                        <div class="row q-col-gutter-sm q-mb-sm" style="min-width: 100%">
                            <div class="col-4"><q-btn class="full-width" color="negative" icon="power_settings_new" label="RESET" /></div>
                            <div class="col-4"><q-btn class="full-width" color="red" icon="pan_tool" label="STOP (HLT)" /></div>
                            <div class="col-4"><q-btn class="full-width" color="secondary" icon="restore" label="CLEAR" /></div>
                            <div class="col-4"><q-btn @click="next" class="full-width" color="primary" icon="redo" label="NEXT (INSTRUCTION)" /></div>
                            <div class="col-4"><q-btn @click="next" class="full-width" color="primary" icon="redo" label="NEXT (CLOCK)" /></div>
                            <div class="col-4"><q-btn class="full-width" color="primary" icon="autorenew" label="NEXT (AUTO)" /></div>
                        </div>

                        <!-- Clock Frequency -->
                        <div class="column">
                            <div class="row items-center">
                                <span class="q-mr-sm">Clock Frequency (ms) {{ clock }}</span>
                                <q-badge rounded>
                                    <span class="help">?</span>
                                    <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                                        Duration in milliseconds of clock tick
                                    </q-tooltip>
                                </q-badge>
                            </div>
                            <q-slider v-model="clock" :min="0" :max="5000" :step="50" label />
                        </div>

                        <!-- statistics -->
                        <div class="column">
                            <span class="row items-center"><span class="q-mr-xs">HLT:</span><LED :state="+computer.clockHLT" :size="16" /></span>
                            <span>Acessos: <q-badge color="primary">{{ computer.counter.accesses }}</q-badge></span>
                            <span>Leituras: <q-badge color="primary">{{ computer.counter.reads }}</q-badge></span>
                            <span>Escritas: <q-badge color="primary">{{ computer.counter.writes }}</q-badge></span>
                            <span>Instruções: <q-badge color="primary">{{ computer.counter.instructions }}</q-badge></span>
                        </div>
                    </BoxWrapper>

                    <!-- Mnemonics -->
                    <BoxWrapper title="Mnemônicos">
                        <div class="row q-col-gutter-sm" style="min-width: 100%">
                            <div v-for="i in Object.keys(instructions)" :key="'instructions-' + i" class="col-3 text-center"><span class="text-bold">{{ instructions[i] }} {{ i }}</span></div>
                        </div>
                    </BoxWrapper>
                </div>
            </div>
            <!--
            <div class="column">
                <span>Diagrama</span>
                <!- Canvas ->
                <img alt="Quasar logo"
                    src="~assets/diagram.png"
                    style="width: 600px; height: auto"
                >
            </div>
            -->
        </div>
    </q-page>
</template>

<style lang="stylus">

.w
    border 1px solid black
    box-shadow 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
    border-radius 4px
    overflow: clip

.title-header
    // border-top-left-radius: 4px
    // border-top-right-radius: 4px
    border-radius: 0
    // box-shadow 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
    font-size: 1.2em

.sticky-table
    height: 500px // actually min height
    flex-grow: 1
    // border-top-left-radius: 0
    // border-top-right-radius: 0
    border-radius: 0
    box-shadow: none

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
        background-color #00b4ff

    thead tr th
        position: sticky
        z-index: 1
        // color white

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
import Neander from '../neander.js'

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

export default defineComponent({
    name: 'IndexPage',
    components: { DigitalSegment, BoxWrapper, LED },
    data: () => ({
        arch: 'Neander',
        computer: new Neander(new Array(256).fill(0)),
        // sim
        clock: 1000
    }),
    setup () {
        return { columns }
    },
    computed: {
        ramRows () {
            const a = this.computer.mnemonics()
            return (this.computer.RAM || []).map((d, i) => ({ data: d, address: i, p: i === this.computer.PC, mnemonic: a[i] }))
        },
        control () {
            return this.computer.control()
        },
        instructions () {
            return {
                0: 'NOP',
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
            }
        }
    },
    methods: {
        next () {
            this.computer.next()
        }
    }
})
</script>
