<template>
    <q-page class="flex justify-around">
        <div class="row justify-center full-width q-py-md q-px-md" style="background-color: #f5f5f5; row-gap: 24px; column-gap: 24px">

            <!-- RAM -->
            <MemoryTable style="flex: 1 1 305.033px" v-if="configStore.showTableProgram" title="Programa" :rows="ramRows" :columns="columnsProgram" @updateRow="updateRow" v-model:base="baseProgram" :instructions="instructions" :breakpoint="computer.BP" @setPointer="setPointer" @setBreakpoint="setBreakpoint" />
            <MemoryTable style="flex: 1 1 152.233px" v-if="configStore.showTableData" title="Dados" :rows="ramRows" :columns="columnsData" @updateRow="updateRow" v-model:base="baseData" />

            <!-- Machine -->
            <div class="column wrapper bg-white" style="flex: 1000 1 453.5px">
                <div class="row justify-between items-center bg-primary text-white q-px-sm q-py-sm">
                    <span class="wrapper-title">Computador</span>
                    <div class="row flex-center">
                        <q-toggle class="q-mr-lg" v-model="is2s" color="green-4" label="2's" left-label dense></q-toggle>
                        <BaseDropdown v-model:value="baseComputer" noBin />
                    </div>
                </div>
                <div class="column q-pa-sm no-wrap" style="overflow: auto; flex-grow: 1; height: 500px">

                    <!-- Architecture -->
                    <div class="row items-center q-mb-sm">
                        <q-select class="full-width" outlined v-model="arch" :options="['Neander']" label="Arquitetura" />
                    </div>

                    <div class="row q-col-gutter-sm">

                        <!-- Accumulator -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-between items-center q-mb-sm">
                            <div class="column items-center">
                                <span>ACC</span>
                                <!--<span>(2's): {{ complement2(computer.ACC) }}</span>-->
                            </div>
                            <DigitalSegment @update="computer.ACC = $event; computer.updateFlags($event)" :value="computer.ACC" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>

                        <!-- Program Counter -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-center items-center q-mb-sm">
                            <span>PC</span>
                            <DigitalSegment @update="computer.PC = $event" :value="computer.PC" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>

                        <!-- OUT -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-center items-center q-mb-sm">
                            <span>OUT</span>
                            <DigitalSegment @update="computer.OUT = $event" :value="computer.OUT" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>

                        <!-- MDR -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-center items-center q-mb-sm">
                            <span>MDR</span>
                            <DigitalSegment @update="computer.MDR = $event" :value="computer.MDR" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>

                        <!-- MAR -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-center items-center q-mb-sm">
                            <span>MAR</span>
                            <DigitalSegment @update="computer.MAR = $event" :value="computer.MAR" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>

                        <!-- RI -->
                        <div class="column col-xs-12 col-sm-6 col-md-4 col-lg-2 justify-center items-center q-mb-sm">
                            <span>RI</span>
                            <DigitalSegment @update="computer.RI = $event" :value="computer.RI" :is2s="is2s" :isHex="baseComputer === 'hexadecimal'" />
                        </div>
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
                            <div class="column flex-center row q-mr-md" v-for="c in control" :key="'control-' + c.key">
                                <span>{{ c.key }}</span>
                                <LED :state="c.state" :size="24" color="red" />
                            </div>
                        </div>
                    </BoxWrapper>

                    <BoxWrapper title="Clock">
                        <template v-slot:after>
                            <div class="relative-position" style="width: 16px; margin-left: 5px">
                                <LED class="absolute-center" :state="Boolean(clock.state)" :size="16" color="blue" />
                            </div>
                        </template>
                        <CanvasClock :clock="clock" v-model:frequency="clock.frequency" />
                    </BoxWrapper>

                    <div class="row full-width">
                        <BoxWrapper title="Temporização de Instrução" style="min-width: 262px; flex-grow: 1" class="q-mr-sm">
                            <div class="row items-center justify-around full-height">
                                <span>Atual: <q-badge color="primary">{{ computer.currentTime != null ? 'T' + computer.currentTime : '--' }}</q-badge></span>
                                <div class="row items-center">
                                    <span>Contador:&nbsp;</span>
                                    <q-badge color="primary">
                                        <div class="column flex-center">
                                            <span>T{{ computer.controlTime }}</span>
                                            <div class="row">
                                                <div class="q-mt-xs" v-for="(b, i) in ([...(computer.controlTime >>> 0).toString(2).padStart(3, '0')].map(n => !!(n * 1)))" :key="'T-' + i">
                                                    <LED :state="b" />
                                                </div>
                                            </div>
                                        </div>
                                    </q-badge>
                                </div>
                            </div>
                        </BoxWrapper>
                        <BoxWrapper title="Instrução" style="min-width: 203.2px; flex-grow: 1">
                            <div class="row items-center justify-around full-height">
                                <span>Ciclo: <q-badge color="primary">{{ computer.currentTime < 3 ? 'Fetch' : 'Execution' }}</q-badge></span>
                                <span>Palavra: <q-badge color="primary">{{ control.filter(c => c.state).map(c => c.key).join(', ') || '---' }}</q-badge></span>
                                <span>Mnemônico: <q-badge color="primary">{{ computer.currentTime < 3 ? '???' : computer.decoder(computer.RI) }}</q-badge></span>
                            </div>
                        </BoxWrapper>
                    </div>
                    <!-- <div>{{ clock.history }}</div> -->

                    <!-- Simulation -->
                    <BoxWrapper title="Simulação">
                        <!-- Actions -->
                        <div class="row q-col-gutter-sm q-mb-sm" style="min-width: 100%">
                            <ControlButton @action-click="nextTick" icon="redo" label="NEXT" subLabel="TICK" />
                            <ControlButton @action-click="nextInstruction" icon="redo" label="NEXT" subLabel="INSTRUCTION" />
                            <ControlButton @action-click="nextUntilHLT" icon="autorenew" label="NEXT" subLabel="AUTO" />
                            <ControlButton @action-click="stop" color="negative" icon="radio_button_checked" label="STOP" subLabel="HLT" />
                            <ControlButton @action-click="reset" color="negative" icon="power_settings_new" label="RESET" />
                            <ControlButton @action-click="clear" color="secondary" icon="restore" label="CLEAR" />
                        </div>

                        <!-- statistics -->
                        <div class="row">
                            <!--<span class="row items-center"><span class="q-mr-xs">HLT:</span><LED :state="computer.clockHLT" :size="16" /></span>-->
                            <span class="q-mr-lg">Acessos: <q-badge color="primary">{{ computer.counter.accesses }}</q-badge></span>
                            <span class="q-mr-lg">Leituras: <q-badge color="primary">{{ computer.counter.reads }}</q-badge></span>
                            <span class="q-mr-lg">Escritas: <q-badge color="primary">{{ computer.counter.writes }}</q-badge></span>
                            <span class="q-mr-lg">Instruções: <q-badge color="primary">{{ computer.counter.instructions }}</q-badge></span>
                        </div>
                    </BoxWrapper>

                    <!-- Mnemonics -->
                    <BoxWrapper title="Mnemônicos">
                        <div class="row q-col-gutter-sm" style="min-width: 100%">
                            <div v-for="i in instructions" :key="'instructions-' + i.value" class="col-xs-3 col-sm-2 col-md-2 col-lg-1 text-center"><span class="text-bold">{{ i.label }} {{ i.value }}</span></div>
                        </div>
                    </BoxWrapper>
                </div>
            </div>
            <!-- Canvas -->
            <div v-if="configStore.showCanvasDiagram" class="column wrapper bg-white"> <!-- style="flex: 1 1 401.833px" -->
                <span class="bg-primary text-white q-px-sm q-py-sm wrapper-title">Diagramação</span>
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
import BaseDropdown from 'components/BaseDropdown.vue'
import ControlButton from 'components/ControlButton.vue'
import Clock from '../clock.js'
import Neander from '../neander.js'
import { saveBlob, intArrayToMem, intArrayToHexdump, partition, complement2 } from '../utils.js'
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
    components: { MemoryTable, DigitalSegment, BoxWrapper, LED, CanvasArchitecture, CanvasClock, DialogSave, DialogLoad, BaseDropdown, ControlButton },
    data: () => ({
        arch: 'Neander',
        clock: null,
        computer: null,
        // sim
        baseProgram: 'decimal',
        baseData: 'decimal',
        baseComputer: 'decimal',
        is2s: false,
        //
        T0HLT: false
    }),
    setup () {
        const configStore = useConfigStore()
        return { columnsProgram, columnsData, configStore, complement2 }
    },
    created () {
        this.clock = new Clock(this.clockCallback)
        this.computer = new Neander(this.configStore.RAMSaved || new Array(256).fill(0), this.computerCallback)
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
        clear () {
            this.computer.resetCounter()
        },
        updateRow (index, value) {
            this.computer.RAM = this.computer.RAM.map((d, i) => i === index ? value : d)
            this.configStore.saveRAM(this.computer.RAM)
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
                    this.configStore.saveRAM(this.computer.RAM) // !!!
                    return
                }

                const txt = (new TextDecoder('utf-8')).decode(arr)

                // Hexdump
                if (txt.slice(0, 8) === '034e4452') {
                    this.computer.RAM = partition(txt.slice(8), 4).map(n => parseInt(n.slice(0, 2), '16'))
                    this.configStore.saveRAM(this.computer.RAM) // !!!
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
