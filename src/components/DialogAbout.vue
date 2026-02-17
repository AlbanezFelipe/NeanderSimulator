<template>
    <q-dialog v-model="show">
        <q-card style="width: 650px">
            <q-card-section class="bg-primary">
                <div class="text-white text-h6">Sobre</div>
            </q-card-section>

            <q-card-section class="q-pt-md q-pb-none">
                <p>O <b class="text-primary">Simulador Computador Neander</b> foi projetado com o intuito de continuar e aprimorar o trabalho original do <a class="text-link-primary" href="https://www.inf.ufrgs.br/site/docente/raul-fernando-weber/" target="_blank">Professor Dr. Raul Weber</a>, redesenhado para aplicações web e mobile com novos recursos inovadores como a diagramação em tempo real da arquitetura executada ciclo a ciclo.</p>
                <p>Este trabalho foi tema de minha <a class="text-link-primary" href="https://albanezfelipe.github.io/docs/Neander/Contin,%20Felipe%20Albanez.%20Trabalho%20de%20conclus%C3%A3o%20de%20curso%20Engenharia%20de%20Computa%C3%A7%C3%A3o.pdf" target="_blank">Monografia de conclusão de curso</a> com a proposta de desenvolver uma ferramenta didática a fim de facilitar a abstração de conceitos de matérias de engenharia de computação, como arquitetura de computadores, e reforçar a prática do estudo.</p>
                <span style="font-size: 12px; color: rgba(0, 0, 0, 0.54);" class="block text-center q-pb-xs">Developed by <a class="text-link" href="https://albanezfelipe.github.io/" target="_blank">Felipe Albanez Contin</a></span>
                <span style="font-size: 12px; color: rgba(0, 0, 0, 0.54);" class="block text-center">This project is under the <a class="text-link" href="https://github.com/AlbanezFelipe/NeanderSimulator/blob/master/LICENSE" target="_blank">General Public License</a></span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="primary" outline label="Fechar" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DialogAbout',
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
