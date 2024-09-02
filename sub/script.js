let roomWidth, roomHeight, sub1X, sub1Y, sub1Dir, sub2X, sub2Y, sub2Dir;
const frequency = 100; // Frequency in Hz
const speedOfSound = 343; // Speed of sound in m/s
let wavelength, resolution, gridX, gridY;

function setup() {
    createCanvas(800, 800);
    pixelDensity(1);
    resolution = 50; // Points per meter

    // Initial values
    roomWidth = parseFloat(document.getElementById('roomWidth').value);
    roomHeight = parseFloat(document.getElementById('roomHeight').value);
    sub1X = parseFloat(document.getElementById('sub1X').value);
    sub1Y = parseFloat(document.getElementById('sub1Y').value);
    sub1Dir = parseFloat(document.getElementById('sub1Dir').value);
    sub2X = parseFloat(document.getElementById('sub2X').value);
    sub2Y = parseFloat(document.getElementById('sub2Y').value);
    sub2Dir = parseFloat(document.getElementById('sub2Dir').value);

    wavelength = speedOfSound / frequency;
    gridX = Array.from({ length: roomWidth * resolution }, (_, i) => i / resolution);
    gridY = Array.from({ length: roomHeight * resolution }, (_, i) => i / resolution);

    document.getElementById('update').addEventListener('click', updateParameters);
    drawSoundDistribution();
}

function draw() {}

function updateParameters() {
    roomWidth = parseFloat(document.getElementById('roomWidth').value);
    roomHeight = parseFloat(document.getElementById('roomHeight').value);
    sub1X = parseFloat(document.getElementById('sub1X').value);
    sub1Y = parseFloat(document.getElementById('sub1Y').value);
    sub1Dir = parseFloat(document.getElementById('sub1Dir').value);
    sub2X = parseFloat(document.getElementById('sub2X').value);
    sub2Y = parseFloat(document.getElementById('sub2Y').value);
    sub2Dir = parseFloat(document.getElementById('sub2Dir').value);

    gridX = Array.from({ length: roomWidth * resolution }, (_, i) => i / resolution);
    gridY = Array.from({ length: roomHeight * resolution }, (_, i) => i / resolution);

    drawSoundDistribution();
}

function calculateSPL(subX, subY, direction) {
    let SPL = new Array(gridY.length).fill(0).map(() => new Array(gridX.length).fill(0));
    for (let i = 0; i < gridY.length; i++) {
        for (let j = 0; j < gridX.length; j++) {
            let x = gridX[j];
            let y = gridY[i];
            let distance = dist(x, y, subX, subY);
            let angle = atan2(y - subY, x - subX) - radians(direction);
            let amplitude = cos(angle);
            SPL[i][j] = amplitude * sin(TWO_PI * distance / wavelength);
        }
    }
    return SPL;
}

function drawSoundDistribution() {
    let SPL1 = calculateSPL(sub1X, sub1Y, sub1Dir);
    let SPL2 = calculateSPL(sub2X, sub2Y, sub2Dir);
    loadPixels();
    for (let i = 0; i < gridY.length; i++) {
        for (let j = 0; j < gridX.length; j++) {
            let idx = 4 * (i * gridX.length + j);
            let SPL_combined = (SPL1[i][j] + SPL2[i][j]) / 2;
            let col = map(SPL_combined, -1, 1, 0, 255);
            pixels[idx] = col;
            pixels[idx + 1] = col;
            pixels[idx + 2] = col;
            pixels[idx + 3] = 255;
        }
    }
    updatePixels();
}
