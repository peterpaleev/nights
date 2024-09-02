// @author peterpaleev
// @title flame microphone 

import { clamp, map } from '/src/modules/num.js'
import { CSS4 } from '/src/modules/color.js'
import { mix, smoothstep } from '/src/modules/num.js'

export const settings = { fps: 30, backgroundColor: 'black', color: 'white' }

const { min, max, sin, floor } = Math

const flame = '----//peterpaleev\\--'
let cols, rows

const noise = valueNoise()

const data = []

let audioContext, analyser, frequencyData

// Define a color palette that ranges from dark colors to light based on the frequency
const palette = [
    'black',        // Lowest frequencies
    'purple',
    'darkred',
    'red',
    'orangered',
    'gold',
    'lemonchiffon', // Highest frequencies
    'white'
];

const bgPalette = [
	'black',        // Lowest frequencies
    'black',        // Lowest frequencies
    'black',
    'darkred',
    'red',
    'orangered',
    'gold',
    'lemonchiffon', // Highest frequencies
];

export function pre(context, cursor, buffer) {
    // Detect resize (and reset buffer, in case)
    if (cols != context.cols || rows != context.rows) {
        cols = context.cols
        rows = context.rows
        data.length = cols * rows
        data.fill(0)
    }

    // Initialize audio context and analyser
    if (!audioContext) {
        initAudio()
    }

    // Get the frequency data from the analyser
    analyser.getByteFrequencyData(frequencyData)

    // Determine the average frequency for mapping
    const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length

    // Fill the floor with some noise influenced by sound
    if (!cursor.pressed) {
        const t = context.time * 0.0015
        const last = cols * (rows - 1)
        for (let i = 0; i < cols; i++) {
            const soundInfluence = map(avgFrequency, 0, 255, 1, 10)
            const val = floor(map(noise(i * 0.05, t), 0, 1, 5, 40) * soundInfluence)
            data[last + i] = min(val, data[last + i] + 2)
        }
    } else {
        const cx = floor(cursor.x)
        const cy = floor(cursor.y)
        data[cx + cy * cols] = rndi(5, 50)
    }

    // Propagate towards the ceiling with some randomness
    for (let i = 0; i < data.length; i++) {
        const row = floor(i / cols)
        const col = i % cols
        const dest = row * cols + clamp(col + rndi(-1, 1), 0, cols - 1)
        const src = min(rows - 1, row + 1) * cols + col
        data[dest] = max(0, data[src] - rndi(0, 2))
    }
}

// Random int betweem a and b, inclusive!
function rndi(a, b=0) {
	if (a > b) [a, b] = [b, a]
	return Math.floor(a + Math.random() * (b - a + 1))
}

export function main(coord, context, cursor, buffer) {
    const u = data[coord.index]
    if (u === 0) return // Inserts a space

    // Determine color based on value and frequency
    let colorIndex = map(u, 0, 50, 0, palette.length - 1);
    let color = palette[floor(colorIndex)];
	let bgColor = bgPalette[floor(colorIndex)];

    // index of the flame character according to the u value
    let index = floor(map(u, 0, 50, 0, flame.length - 1))

    return {
        char: flame[index],
        color: color,
        fontWeight: u > 20 ? 700 : 100,
		backgroundColor : bgColor,
    }
}

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    const bufferLength = analyser.frequencyBinCount
    frequencyData = new Uint8Array(bufferLength)

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
    }).catch(err => {
        console.error('Error accessing microphone', err)
    })
}
// Value noise:
// https://www.scratchapixel.com/lessons/procedural-generation-virtual-worlds/procedural-patterns-noise-part-1
function valueNoise() {
    const tableSize = 256
    const r = new Array(tableSize)
    const permutationTable = new Array(tableSize * 2)

    // Create an array of random values and initialize permutation table
    for (let k = 0; k < tableSize; k++) {
        r[k] = Math.random()
        permutationTable[k] = k
    }

    // Shuffle values of the permutation table
    for (let k = 0; k < tableSize; k++) {
        const i = Math.floor(Math.random() * tableSize)
        // swap
        ;[permutationTable[k], permutationTable[i]] = [permutationTable[i], permutationTable[k]]
        permutationTable[k + tableSize] = permutationTable[k]
    }

    return function (px, py) {
        const xi = Math.floor(px)
        const yi = Math.floor(py)

        const tx = px - xi
        const ty = py - yi

        const rx0 = xi % tableSize
        const rx1 = (rx0 + 1) % tableSize
        const ry0 = yi % tableSize
        const ry1 = (ry0 + 1) % tableSize

        // Random values at the corners of the cell using permutation table
        const c00 = r[permutationTable[permutationTable[rx0] + ry0]]
        const c10 = r[permutationTable[permutationTable[rx1] + ry0]]
        const c01 = r[permutationTable[permutationTable[rx0] + ry1]]
        const c11 = r[permutationTable[permutationTable[rx1] + ry1]]

        // Remapping of tx and ty using the Smoothstep function
        const sx = smoothstep(0, 1, tx)
        const sy = smoothstep(0, 1, ty)

        // Linearly interpolate values along the x axis
        const nx0 = mix(c00, c10, sx)
        const nx1 = mix(c01, c11, sx)

        // Linearly interpolate the nx0/nx1 along the y axis
        return mix(nx0, nx1, sy)
    }
}



import { drawInfo } from '/src/modules/drawbox.js'
// export function post(context, cursor, buffer) {
//     drawInfo(context, cursor, buffer)
// }