const W = window.innerWidth;
const H = window.innerHeight;
const resolution = 1;
const cols = Math.floor(W / resolution) * resolution + resolution;
const rows = Math.floor(H / resolution) * resolution + resolution;
const Wi = cols * Math.pow(2, 16);
const Hi = rows * Math.pow(2, 16);

const dot = {
    x: Math.floor(cols / 2) + Wi,
    y: Math.floor(rows / 2) + Hi
}

function setup() {
    createCanvas(cols - resolution, rows - resolution);
    strokeWeight(resolution);
    background(0);
}

let state = 0;
function direction(i) {
    state = ((state + 1/i) * 10) % 1;
    return state;
    // return Math.random();
}

function drawPoint() {
    const dir = direction(dot.x + dot.y);
    if (dir < 0.25) {
        dot.x += resolution;
    } else if (dir < 0.5) {
        dot.x -= resolution;
    } else if (dir < 0.75) {
        dot.y += resolution;
    } else {
        dot.y -= resolution;
    }

    const x = dot.x % cols;
    const y = dot.y % rows;

    const color = get(x, y);
    let R = color[0];
    let G = color[1];
    let B = color[2];
    B += 10;
    if (B >= 255) {
        B = 0;
        G += 10;
    }
    if (G >= 255) {
        G = 0;
        R += 10;
    }
    if (R >= 255) {
        noLoop();
        console.log('Art over.');
    }
    stroke(R, G, B);
    point(x, y);
}

function draw() {
    for (let i = 0; i < 10000; i++) {
        drawPoint();
    }
}