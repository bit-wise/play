const W = window.innerWidth;
const H = W;// window.innerHeight;
const batch = 100;
const resolution = 6;
const cols = Math.floor(W / resolution) * resolution + resolution;
const rows = Math.floor(H / resolution) * resolution + resolution;
const Wi = cols * Math.pow(2, 16);
const Hi = rows * Math.pow(2, 16);
const colorScaler = 50;
const halfRes = resolution / 2;
const canvasSize = {
    w: cols - resolution,
    h: rows - resolution
}

const dot = {
    x: Math.floor(cols / 2) + Wi,
    y: Math.floor(rows / 2) + Hi
}

function setup() {
    createCanvas(canvasSize.w, canvasSize.h);
    noStroke();
    noFill();
    background(0);
}

let state = 1/(Date.now());
function direction(i) {
    state = ((state + 1 / i) * 10) % 1;
    return state;
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
    B += colorScaler;
    if (B >= 255) {
        B = 0;
        G += colorScaler;
    }
    if (G >= 255) {
        G = 0;
        R += colorScaler;
    }
    if (R >= 255) {
        noLoop();
        console.log('Art over.');
    }
    fill(R, G, B);
    rect(x, y, halfRes, halfRes);
}

function drawLine() {
    const ox = dot.x % cols;
    const oy = dot.y % rows;
    const dir = direction(dot.x + dot.y);
    dot.x += Math.sin(dir * TWO_PI) * resolution;
    dot.y += Math.cos(dir * TWO_PI) * resolution;

    const x = Math.round(dot.x % cols);
    const y = Math.round(dot.y % rows);

    if (x > resolution && y > resolution && x < canvasSize.w && y < canvasSize.h) {
        const color = get(x, y);
        let R = color[0];
        let G = color[1];
        let B = color[2];
        B += colorScaler;
        if (B >= 255) {
            B = 0;
            G += colorScaler;
        }
        if (G >= 255) {
            G = 0;
            R += colorScaler;
        }
        if (R >= 255) {
            noLoop();
            console.log('Art over.');
        }
        stroke(R, G, B);
        line(ox, oy, x, y);
    }
}

function draw() {
    for (let i = 0; i < batch; i++) {
        drawLine();
    }
}