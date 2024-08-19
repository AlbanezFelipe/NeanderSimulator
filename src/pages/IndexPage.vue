<template>
    <q-page class="flex justify-around">
        <div class="row justify-center full-width no-wrap q-py-md q-px-md">

            <!-- RAM -->
            <MemoryTable title="Programa" :rows="ramRows" :columns="columnsProgram" @updateRow="updateRow" v-model:base="baseProgram" :instructions="instructions" />
            <MemoryTable class="q-ml-lg" title="Dados" :rows="ramRows" :columns="columnsData" @updateRow="updateRow" v-model:base="baseData" />

            <!-- Machine -->
            <div class="column wrapper q-ml-lg">
                <span class="bg-primary text-white q-px-sm q-py-sm wrapper-title">Computador</span>
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
                            <span class="row items-center"><span class="q-mr-xs">HLT:</span><LED :state="computer.clockHLT" :size="16" /></span>
                            <span>Acessos: <q-badge color="primary">{{ computer.counter.accesses }}</q-badge></span>
                            <span>Leituras: <q-badge color="primary">{{ computer.counter.reads }}</q-badge></span>
                            <span>Escritas: <q-badge color="primary">{{ computer.counter.writes }}</q-badge></span>
                            <span>Instruções: <q-badge color="primary">{{ computer.counter.instructions }}</q-badge></span>
                        </div>
                    </BoxWrapper>

                    <!-- Mnemonics -->
                    <BoxWrapper title="Mnemônicos">
                        <div class="row q-col-gutter-sm" style="min-width: 100%">
                            <div v-for="i in instructions" :key="'instructions-' + i.value" class="col-3 text-center"><span class="text-bold">{{ i.label }} {{ i.value }}</span></div>
                        </div>
                    </BoxWrapper>
                </div>
            </div>
            <!-- Canvas -->
            <div class="column wrapper q-ml-lg">
                <span class="bg-primary text-white q-px-sm q-py-sm wrapper-title">Diagrama</span>
                <CanvasArchitecture :computer="computer" />
            </div>
        </div>
    </q-page>
</template>

<style lang="stylus">
</style>

<script>
import { defineComponent } from 'vue'
import MemoryTable from 'components/MemoryTable.vue'
import DigitalSegment from 'components/DigitalSegment.vue'
import BoxWrapper from 'components/BoxWrapper.vue'
import LED from 'components/LED.vue'
import CanvasArchitecture from 'components/CanvasArchitecture.vue'
import Neander from '../neander.js'

const columnsProgram = [
    {
        name: 'p',
        label: 'P.',
        align: 'center',
        field: row => row.p,
        format: val => !!val
    },
    {
        name: 'address',
        label: 'Endereço',
        align: 'center',
        field: row => row.address,
        format: val => `${val}`
    },
    {
        name: 'data',
        label: 'Data',
        align: 'center',
        field: row => row.data,
        format: val => `${val}`
    },
    {
        name: 'mnemonic',
        label: 'Mnemônico',
        align: 'center',
        field: row => row.mnemonic,
        format: val => `${val}`
    }
]

const columnsData = [
    {
        name: 'address',
        label: 'Endereço',
        align: 'center',
        field: row => row.address,
        format: val => `${val}`
    },
    {
        name: 'data',
        label: 'Data',
        align: 'center',
        field: row => row.data,
        format: val => `${val}`
    }
]

export default defineComponent({
    name: 'IndexPage',
    components: { MemoryTable, DigitalSegment, BoxWrapper, LED, CanvasArchitecture },
    data: () => ({
        arch: 'Neander',
        computer: new Neander(new Array(256).fill(0)),
        // sim
        clock: 1000,
        baseProgram: 'decimal',
        baseData: 'decimal'
    }),
    setup () {
        return { columnsProgram, columnsData }
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
            const o = Neander.instructions()
            return Object.keys(o).map(k => ({ value: k * 1, label: o[k] }))
        }
    },
    methods: {
        updateRow (index, value) {
            this.computer.RAM = this.computer.RAM.map((d, i) => i === index ? value : d)
        },
        next () {
            this.computer.next()
        }
    }
})
</script>
