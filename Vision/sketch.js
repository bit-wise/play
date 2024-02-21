const W = window.innerWidth;
const H = window.innerHeight;
const resolution = 1;

let grid, cols, rows;
let state = Math.PI;
let offset = 2;

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Uint8Array(rows);
    }
    return arr;
}

function rando() {
    state = (state * offset) % 1;
    offset += 0.0001;
    return state
}

function setup() {
    createCanvas(W, H);
    cols = Math.ceil(W / resolution);
    rows = Math.ceil(H / resolution);

    grid = make2DArray(cols, rows);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y] = rando() > 0.5 ? 1 : 0;
        }
    }
    noStroke();
    background(0);
}

function draw() {
    noLoop();
    fill(255);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                rect(i * resolution, j * resolution, resolution, resolution);
            }
        }
    }
}