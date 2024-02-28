const W = window.innerWidth;
const H = window.innerHeight;
const Wi = W * Math.pow(2, 16);
const Hi = H * Math.pow(2, 16);
const resolution = 10;

const dot = {
    x: Math.floor(W / 2) + Wi,
    y: Math.floor(H / 2) + Hi
}

function setup() {
    createCanvas(W, H);
    strokeWeight(resolution);
    background(0);
}


function direction() {
    return Math.random();
}

function drawPoint() {
    const dir = direction();
    if (dir < 0.25) {
        dot.x += resolution;
    } else if (dir < 0.5) {
        dot.x -= resolution;
    } else if (dir < 0.75) {
        dot.y += resolution;
    } else {
        dot.y -= resolution;
    }

    const x = dot.x % W;
    const y = dot.y % H;

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