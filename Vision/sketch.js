const W = window.innerWidth;
const H = window.innerHeight;
const resolution = 1;

// let state = Math.PI;
// let offset = 2;
// function rando() {
//     state = (state * offset) % 1;
//     offset += 0.0001;
//     return state
// }

let state = Math.PI;
function rando() {
    state = Math.sin(1 / state) + Math.cos(1 / (state + 1)) + 1;
    console.log(state);
    return state % 1;
}

function drawPoint() {
    const x = Math.floor(rando() * W);
    const y = Math.floor(rando() * H);
    point(x, y);
}

function setup() {
    createCanvas(W, H);
    stroke(255);
    background(0);
}

function draw() {
    for (let i = 0; i < 100; i++) {
        drawPoint();
    }
    noLoop();
}