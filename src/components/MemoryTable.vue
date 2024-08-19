<template>
    <div class="column wrapper">
        <div class="row justify-between items-center bg-primary text-white q-py-sm q-px-sm no-wrap">
            <span class="wrapper-title q-pr-sm">{{ title }}</span>
            <div class="row flex-center no-wrap">
                <q-btn-dropdown flat color="white" dense :label="bases[base]">
                    <q-list>
                        <q-item clickable v-close-popup @click="updateBase('binary')">
                            <q-item-section>
                                <q-item-label>binary 0..1</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item clickable v-close-popup @click="updateBase('decimal')">
                            <q-item-section>
                                <q-item-label>decimal 0..9</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item clickable v-close-popup @click="updateBase('hexadecimal')">
                            <q-item-section>
                                <q-item-label>hexadecimal 0..F</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <!--<q-btn @click="hide = true" size="sm" flat padding="xs" color="white" icon="remove" />-->
            </div>
        </div>
        <q-table
            class="sticky-table"
            :rows="rows"
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
                    <q-popup-edit :model-value="props.row.data" @update:model-value="$emit('updateRow', props.row.address, $event)" title="Update data" buttons v-slot="scope">
                        <q-input type="number" v-model.number="scope.value" dense autofocus />
                    </q-popup-edit>
                </q-td>
            </template>

            <template v-slot:body-cell-mnemonic="props">
                <q-td :props="props">
                    {{ props.row.mnemonic }}
                    <q-popup-edit :model-value="props.row.data" @update:model-value="$emit('updateRow', props.row.address, $event)" title="Update data" buttons v-slot="scope">
                        <q-select v-model="scope.value" :options="instructions" dense autofocus emit-value map-options />
                    </q-popup-edit>
                </q-td>
            </template>

        </q-table>
    </div>
</template>

<style lang="stylus">

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

const bases = {
    binary: '0..1',
    decimal: '0..9',
    hexadecimal: '0..F'
}

export default defineComponent({
    name: 'MemoryTable',
    setup () {
        return { bases }
    },
    props: {
        title: {
            type: String,
            required: true
        },
        rows: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        base: {
            type: String,
            required: true
        },
        instructions: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        updateBase (base) {
            this.$emit('update:base', base)
        }
    }
})
</script>
