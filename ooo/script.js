const letters = ["𝜭", "𝜣", "𝜪"];
let index = 0;
const bpm = 100;
const interval = (60 / bpm) * 1000;

function changeLetter() {
    document.getElementById("letter").textContent = letters[index];
    index = (index + 1) % letters.length;
}

setInterval(changeLetter, interval);
