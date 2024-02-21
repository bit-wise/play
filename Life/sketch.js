const W = Math.floor(window.innerWidth / 2) * 2 - 1;
const H = Math.floor(window.innerHeight / 2) * 2 - 1;
const W2 = Math.ceil(W / 2);
const H2 = Math.ceil(H / 2);
const fps = 24;
const fps1 = 1 / fps;

const interval = fps * 60;

let grid;
let cols;
let cols1;
let rows;
let resolution = 1;

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Uint8Array(rows);
    }
    return arr;
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

let seed = new Date().getTime();
let rstate = seed / Math.PI;
let roffset = 2;
function rando() {
    rstate = (rstate * roffset) % 1;
    // roffset += 0.0001;
    roffset += rstate;
    return rstate
}

function makeGrid() {
    cols = Math.ceil(W / resolution);
    rows = Math.ceil(H / resolution);
    // cols1 = 1 / (Math.max(cols, rows) / 2 / Math.PI);
    cols1 = (1 / cols + 1 / rows) * 1;

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = rando() > rando() ? 1 : 0;
        }
    }
}

function setup() {
    frameRate(fps);
    createCanvas(W, H);
    makeGrid();
    fill(255, 255, 255, 255);
    noStroke();
    background(0);
}

let I = -3;
let O = 0;
let P = 0;
function draw() {
    background(0, 0, 0, 255);
    I++;
    O = 0
    P = 0
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                O+= cols1;
                P+= fps1;
            }
        }
    }
    P = round(P);
    // if (I++ > 1000) {
    //     I = 0;
    //     makeGrid();
    // }

    // if (I % 2) {
    //     fill(255, 255, 255, 64);
    // }else {
    //     fill(0, 0, 0, 64);
    // }

    let next = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(grid, i, j);

            if (state == 0 && neighbors == 3) {
                next[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                next[i][j] = 0;
            } else {
                next[i][j] = state;
            }

            if (I % P == 0 && i > W2 - O && i < W2 + O && j > H2 - O && j < H2 + O) {
                // next[i][j] = rando() > rando() ? 1 : 0;//!state;
                next[i][j] = !state;
            }
        }
    }

    grid = next;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                rect(i * resolution, j * resolution, resolution, resolution);
            }
        }
    }
}