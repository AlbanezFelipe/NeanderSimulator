<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title>
                    Simulador Neander
                </q-toolbar-title>

                <q-space />

                <div class="row flex-center">
                    <q-btn @click="configStore.toggleTableProgram" :color="configStore.showTableProgram ? 'blue' : 'white'" :flat="!configStore.showTableProgram" label="P" />
                    <q-btn @click="configStore.toggleTableData" :color="configStore.showTableData ? 'blue' : 'white'" :flat="!configStore.showTableData" label="D" class="q-mx-sm" />
                    <q-btn @click="configStore.toggleCanvasDiagram" :color="configStore.showCanvasDiagram ? 'blue' : 'white'" :flat="!configStore.showCanvasDiagram" icon="account_tree" />
                </div>

                <q-space />

                <q-btn @click="$refs.view.load?.()" color="white" outline label="Load" icon="upload" />
                <q-btn @click="$refs.view.save?.()" class="q-ml-sm" color="negative" label="Save" icon="save" />
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            bordered
        >
            <q-list>
                <q-item-label
                    header
                >
                    Essential Links
                </q-item-label>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view v-slot="{ Component }">
                <component ref="view" :is="Component" />
            </router-view>
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useConfigStore } from 'stores/config.js'

export default defineComponent({
    name: 'MainLayout',
    setup () {
        const leftDrawerOpen = ref(false)

        return {
            leftDrawerOpen,
            toggleLeftDrawer () {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },
            configStore: useConfigStore()
        }
    }
})
</script>
