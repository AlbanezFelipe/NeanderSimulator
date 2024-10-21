export const saveBlob = (blob, fileName) => {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

export const intArrayToMem = arr => {
    const prefix = [19971, 21060]
    return new Blob([new Uint16Array([...prefix, ...arr])])
}

export const intArrayToHexdump = arr => {
    const prefix = ['034e', '4452']
    return new Blob([[...prefix, ...arr.map(n => n.toString('16').padStart(2, '0').padEnd(4, '0'))].join('')], { type: 'text/plain' })
}

export const partition = (arr, n) => {
    const o = []
    for (let i = 0; i < arr.length; i += n) {
        o.push(arr.slice(i, i + n))
    }
    return o
}

export const complement2 = n => n & 128 ? -1 * ((n ^ 255) + 1) : n
