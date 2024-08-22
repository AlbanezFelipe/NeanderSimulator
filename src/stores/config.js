import { defineStore } from 'pinia'

const b = v => v === undefined ? true : Boolean(+v)

export const useConfigStore = defineStore('config', {
    state: () => ({
        showTableProgram: b(localStorage.showTableProgram),
        showTableData: b(localStorage.showTableData),
        showCanvasDiagram: b(localStorage.showCanvasDiagram)
    }),
    actions: {
        toggleTableProgram () {
            this.showTableProgram = !this.showTableProgram
            localStorage.showTableProgram = +this.showTableProgram
        },
        toggleTableData () {
            this.showTableData = !this.showTableData
            localStorage.showTableData = +this.showTableData
        },
        toggleCanvasDiagram () {
            this.showCanvasDiagram = !this.showCanvasDiagram
            localStorage.showCanvasDiagram = +this.showCanvasDiagram
        }
    }
})
