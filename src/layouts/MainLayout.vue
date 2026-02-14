<template>
    <q-layout view="hHh Lpr lFf">
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

                <q-toolbar-title shrink class="topbar-hide" style="min-width: 245px">
                    Simulador Neander
                </q-toolbar-title>

                <q-space />

                <div class="row flex-center">
                    <q-btn @click="configStore.toggleTableProgram" :color="configStore.showTableProgram ? 'blue' : 'white'" :flat="!configStore.showTableProgram" label="P" />
                    <q-btn @click="configStore.toggleTableData" :color="configStore.showTableData ? 'blue' : 'white'" :flat="!configStore.showTableData" label="D" class="q-mx-sm" />
                    <q-btn @click="configStore.toggleCanvasDiagram" :color="configStore.showCanvasDiagram ? 'blue' : 'white'" :flat="!configStore.showCanvasDiagram" icon="account_tree" />
                </div>

                <q-space />

                <q-btn @click="$refs.view.load?.()" color="white" outline>
                    <q-icon name="upload" />
                    <span class="topbar-hide on-right">Carregar</span>
                </q-btn>
                <q-btn @click="$refs.view.save?.()" class="q-ml-sm" color="negative">
                    <q-icon name="save" />
                    <span class="topbar-hide on-right">Salvar</span>
                </q-btn>

            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" overlay bordered class="relative-position column no-wrap">
            <q-list padding>
                <q-item clickable v-ripple>
                    <q-item-section avatar><q-icon name="o_code" /></q-item-section>
                    <q-item-section>Carregar Exemplos</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar><q-icon name="o_refresh" /></q-item-section>
                    <q-item-section>Limpar Memória</q-item-section>
                </q-item>
                <q-separator class="q-my-sm" />
                <a class="router-link" target="_blank" href="https://albanezfelipe.github.io/docs/Neander/Contin,%20Felipe%20Albanez.%20Trabalho%20de%20conclus%C3%A3o%20de%20curso%20Engenharia%20de%20Computa%C3%A7%C3%A3o.pdf">
                    <q-item clickable v-ripple>
                        <q-item-section avatar><q-icon name="o_article" /></q-item-section>
                        <q-item-section>Monografia do Projeto</q-item-section>
                    </q-item>
                </a>
                <a class="router-link" target="_blank" href="https://github.com/AlbanezFelipe/NeanderSimulator">
                    <q-item clickable v-ripple>
                        <q-item-section avatar><q-icon name="fa-brands fa-github" /></q-item-section>
                        <q-item-section>Repositório GitHub</q-item-section>
                    </q-item>
                </a>
                <a class="router-link" target="_blank" href="http://wiki.icmc.usp.br/images/5/58/SSC0610-Aula03s-Neander.pdf">
                    <q-item clickable v-ripple>
                        <q-item-section avatar><q-icon name="o_integration_instructions" /></q-item-section>
                        <q-item-section>Documentação Neander Original</q-item-section>
                    </q-item>
                </a>
                <q-separator class="q-my-sm" />
                <q-item clickable v-ripple>
                    <q-item-section avatar><q-icon name="o_info" /></q-item-section>
                    <q-item-section>Sobre</q-item-section>
                </q-item>
            </q-list>
            <q-space />
            <div class="q-pb-sm" style="text-align: center; text-size: 12px; color: #787f89">Versão 1.0.2 - 14/02/2026</div>
        </q-drawer>

        <q-page-container>
            <router-view v-slot="{ Component }">
                <component ref="view" :is="Component" />
            </router-view>
        </q-page-container>
    </q-layout>
</template>

<style lang="stylus">
    @media (max-width: 800px)
        .topbar-hide
            display: none

</style>

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
