const minWindow = 720// Math.min(window.innerWidth, window.innerHeight);
const W = minWindow;
const H = minWindow;
const WH = W * H;
const W2 = Math.ceil(W / 2);
const H2 = Math.ceil(H / 2);

// Conway's Game of Life

let grid;
let cols;
let rows;
let resolution = 1;
let epoch = 0;
let fps = 12;
let old_seed = 0;

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
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

function setup() {
    frameRate(fps);
    createCanvas(W, H);
    cols = Math.ceil(W / resolution);
    rows = Math.ceil(H / resolution);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0
        }
    }
    noStroke();
    background(0);
}

function draw() {
    background(0);

    let next = make2DArray(cols, rows);

    let seed = round(map(round(new Date().getTime() / 1000) % 86400, 0, 86400, 0, W2));

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            // Count live neighbors!
            let neighbors = countNeighbors(grid, i, j);

            if (state == 0 && neighbors == 3) {
                next[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                next[i][j] = 0;
            } else {
                next[i][j] = state;
            }

            let c2 = round(cols / 2);
            let r2 = round(rows / 2);
            let r = seed;
            let L = c2 - r
            let R = c2 + r
            let T = r2 - r
            let B = r2 + r
            let b = 1


            if (old_seed != seed) {
                if (i > L && i < R && j > T && j < B) {
                    if (i == L + b || i == R - b || j == T + b || j == B - b) {
                        next[i][j] = !state
                    }
                }
            }
        }
    }

    if (old_seed != seed) {
        epoch++;
    }
    old_seed = seed;

    grid = next;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (grid[i][j] == 1) {
                fill(255);
                rect(x, y, resolution, resolution);
            }
        }
    }
}
