let video;
let saturationSlider, colorSlider, brightnessSlider;

function setup() {
    //noCanvas();
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.parent('video-container');
    
    saturationSlider = select('#saturationSlider');
    colorSlider = select('#colorSlider');
    brightnessSlider = select('#brightnessSlider');
}

function draw() {
    video.loadPixels();
    for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
            // Flip the x coordinate
            let flippedX = video.width - 1 - x;
            let index = (flippedX + y * video.width) * 4;
            let r = video.pixels[index + 0];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];

            let hsb = rgbToHsb(r, g, b);
            hsb[1] *= saturationSlider.value();
            hsb[0] *= colorSlider.value();
            hsb[2] *= brightnessSlider.value();

            let rgb = hsbToRgb(hsb[0], hsb[1], hsb[2]);
            // Use original x for setting pixels to flip the image
            let originalIndex = (x + y * video.width) * 4;
            video.pixels[originalIndex + 0] = rgb[0];
            video.pixels[originalIndex + 1] = rgb[1];
            video.pixels[originalIndex + 2] = rgb[2];
        }
    }
    video.updatePixels();
}

function rgbToHsb(r, g, b) {
    // Convert RGB to HSB
    let maxValue = max(r, g, b), minValue = min(r, g, b);
    let h, s, v = maxValue;
    let d = maxValue - minValue;
    s = maxValue == 0 ? 0 : d / maxValue;
    if (maxValue == minValue) {
        h = 0;
    } else {
        switch (maxValue) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}

function hsbToRgb(h, s, v) {
    // Convert HSB to RGB
    let r, g, b;
    let i = floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}
