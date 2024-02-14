const W = window.innerWidth;
const H = window.innerHeight;
const WH = W * H;

// Conway's Game of Life

let grid;
let cols;
let rows;
let resolution = 2;

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
    createCanvas(W, H);
    cols = Math.ceil(W / resolution);
    rows = Math.ceil(H / resolution);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0//floor(random(2));
        }
    }
}

function draw() {
    background(0, 0, 0, 32);

    let next = make2DArray(cols, rows);

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
            let r = 3;

            if (i > c2 - r && i < c2 + r && j > r2 - r && j < r2 + r) {
                next[i][j] = floor(random(2));
            }
        }
    }

    grid = next;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (grid[i][j] == 1) {
                fill(255);
                stroke(0);
                rect(x, y, resolution, resolution);
            }
        }
    }
}
