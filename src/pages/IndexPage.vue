<template>
    <q-page class="flex justify-around">
        <div class="row justify-center full-width no-wrap q-py-md q-px-md">

            <!-- RAM -->
            <MemoryTable v-if="configStore.showTableProgram" class="q-mr-lg" title="Programa" :rows="ramRows" :columns="columnsProgram" @updateRow="updateRow" v-model:base="baseProgram" :instructions="instructions" :breakpoint="computer.BP" @setPointer="setPointer" @setBreakpoint="setBreakpoint" />
            <MemoryTable v-if="configStore.showTableData" class="q-mr-lg" title="Dados" :rows="ramRows" :columns="columnsData" @updateRow="updateRow" v-model:base="baseData" />

            <!-- Machine -->
            <div class="column wrapper">
                <span class="bg-primary text-white q-px-sm q-py-sm wrapper-title">Computador</span>
                <div class="column q-pa-sm no-wrap" style="overflow: auto; flex-grow: 1; height: 500px">

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

                     <!-- MDR -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>MDR</span>
                        <DigitalSegment @update="computer.MDR = $event" :value="computer.MDR" />
                    </div>

                     <!-- MAR -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>MAR</span>
                        <DigitalSegment @update="computer.MAR = $event" :value="computer.MAR" />
                    </div>

                     <!-- RI -->
                    <div class="row justify-between items-center q-mb-sm">
                        <span>RI</span>
                        <DigitalSegment @update="computer.RI = $event" :value="computer.RI" />
                    </div>

                    <!-- Flags -->
                    <BoxWrapper title="Flags">
                        <div class="row justify-around">
                            <div class="row" v-for="f in flags" :key="'flag-' + f.key">
                                <span class="q-mr-sm">{{ f.key }}</span>
                                <LED :state="f.state" :size="24" />
                            </div>
                        </div>
                    </BoxWrapper>

                    <!-- Control Unit -->
                    <BoxWrapper title="Unidade de Controle">
                        <div class="row justify-around">
                            <div class="row" v-for="c in control" :key="'control-' + c.key">
                                <span class="q-mr-sm">{{ c.key }}</span>
                                <LED :state="c.state" :size="24" color="red" />
                            </div>
                        </div>
                    </BoxWrapper>

                    <CanvasClock :clock="clock" />

                    <div>t{{ computer.controlTime }}</div>
                    <span class="row items-center"><span class="q-mr-xs">Clock:</span><LED :state="Boolean(clock.state)" :size="24" color="blue" /></span>
                    <!-- <div>{{ clock.history }}</div> -->

                    <!-- Simulation -->
                    <BoxWrapper title="Simulação">
                        <!-- Actions -->
                        <div class="row q-col-gutter-sm q-mb-sm" style="min-width: 100%">
                            <div class="col-4"><q-btn @click="reset" class="full-width" color="negative" icon="power_settings_new" label="RESET" /></div>
                            <div class="col-4"><q-btn @click="stop" class="full-width" color="negative" icon="radio_button_checked" label="STOP (HLT)" /></div>
                            <div class="col-4"><q-btn class="full-width" color="secondary" icon="restore" label="CLEAR" /></div>
                            <div class="col-4"><q-btn @click="nextInstruction" class="full-width" color="primary" icon="redo" label="NEXT (INSTRUCTION)" /></div>
                            <div class="col-4"><q-btn @click="nextTick" class="full-width" color="primary" icon="redo" label="NEXT (CLOCK)" /></div>
                            <div class="col-4"><q-btn @click="nextUntilHLT" class="full-width" color="primary" icon="autorenew" label="NEXT (AUTO)" /></div>
                        </div>

                        <!-- Clock Frequency -->
                        <div class="column">
                            <div class="row items-center">
                                <span class="q-mr-sm">Clock Frequency (ms) {{ clock.frequency }}ms {{ (1000 / clock.frequency).toFixed(3) }}Hz</span>
                                <q-badge rounded>
                                    <span class="help">?</span>
                                    <q-tooltip anchor="center right" self="center left" :offset="[4, 4]">
                                        Duration in milliseconds of clock tick
                                    </q-tooltip>
                                </q-badge>
                            </div>
                            <q-slider v-model="clock.frequency" :min="0" :max="5000" :step="50" label />
                        </div>

                        <!-- statistics -->
                        <div class="column">
                            <!--<span class="row items-center"><span class="q-mr-xs">HLT:</span><LED :state="computer.clockHLT" :size="16" /></span>-->
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
            <div v-if="configStore.showCanvasDiagram" class="column wrapper q-ml-lg">
                <span class="bg-primary text-white q-px-sm q-py-sm wrapper-title">Diagrama</span>
                <CanvasArchitecture :computer="computer" />
            </div>
        </div>
        <DialogSave ref="dialogsave" @save="download" />
        <DialogLoad ref="dialogload" @load="readFile" />
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
import CanvasClock from 'components/CanvasClock.vue'
import DialogSave from 'components/DialogSave.vue'
import DialogLoad from 'components/DialogLoad.vue'
import Clock from '../clock.js'
import Neander from '../neander.js'
import { saveBlob, intArrayToMem, intArrayToHexdump, partition } from '../utils.js'
import { useConfigStore } from 'stores/config.js'

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
    components: { MemoryTable, DigitalSegment, BoxWrapper, LED, CanvasArchitecture, CanvasClock, DialogSave, DialogLoad },
    data: () => ({
        arch: 'Neander',
        clock: null,
        computer: null,
        // sim
        baseProgram: 'decimal',
        baseData: 'decimal',
        //
        T0HLT: false
    }),
    setup () {
        const configStore = useConfigStore()
        return { columnsProgram, columnsData, configStore }
    },
    created () {
        this.clock = new Clock(this.clockCallback)
        this.computer = new Neander(new Array(256).fill(0), this.computerCallback)
    },
    computed: {
        ramRows () {
            const a = this.computer.mnemonics()
            return (this.computer.RAM || []).map((d, i) => ({ data: d, address: i, p: i === this.computer.PC, mnemonic: a[i] }))
        },
        flags () {
            return Object.keys(this.computer.flags).map(k => ({ key: k, state: Boolean(this.computer.flags[k]) }))
        },
        control () {
            return Object.keys(this.computer.controlUnit).map(k => ({ key: k, state: Boolean(this.computer.controlUnit[k]) }))
        },
        instructions () {
            const o = this.computer.instructions
            return Object.keys(o).map(k => ({ value: k * 1, label: o[k] }))
        }
    },
    methods: {
        clockCallback () {
            this.computer.next()
        },
        computerCallback (event) {
            if (event === 'HLT') this.clock.setMode(0)
            if (event === 'T0' && this.T0HLT) {
                this.clock.setMode(0)
                this.T0HLT = false
            }
        },
        nextTick () {
            this.clock.trigger()
        },
        nextInstruction () {
            this.clock.setMode(1)
            this.T0HLT = true
        },
        nextUntilHLT () {
            this.clock.setMode(1)
        },
        stop () {
            this.clock.setMode(0)
        },
        reset () {
            this.clock.setMode(0)
            this.computer = new Neander(this.computer.RAM, this.computerCallback)
        },
        updateRow (index, value) {
            this.computer.RAM = this.computer.RAM.map((d, i) => i === index ? value : d)
        },
        save () {
            this.$refs.dialogsave.call()
        },
        load () {
            this.$refs.dialogload.call()
        },
        download (name, format) {
            saveBlob(({
                mem: intArrayToMem,
                hex: intArrayToHexdump,
                txt: d => new Blob([d.join('\n')], { type: 'text/plain' })
            })[format](this.computer.RAM), `${name}.${format}`)
        },
        readFile (file) {
            file.arrayBuffer().then(buffer => {
                const arr = new Uint16Array(buffer)
                // mem
                if (arr[0] + arr[1] === 41031) {
                    this.computer.RAM = [...arr.slice(2)]
                    return
                }

                const txt = (new TextDecoder('utf-8')).decode(arr)

                // Hexdump
                if (txt.slice(0, 8) === '034e4452') {
                    this.computer.RAM = partition(txt.slice(8), 4).map(n => parseInt(n.slice(0, 2), '16'))
                    // return
                }
            })
        },
        setPointer (PC) {
            this.computer.PC = PC
        },
        setBreakpoint (BP) {
            this.computer.BP = BP
        }
    }
})
</script>
