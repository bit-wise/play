const minWindow = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 2) * 2 - 1;
// const W = minWindow;
// const H = minWindow;
const W = Math.floor(window.innerWidth / 2) * 2 - 1;
const H = Math.floor(window.innerHeight / 2) * 2 - 1;;
const WH = W * H;
const W2 = Math.ceil(W / 2);
const H2 = Math.ceil(H / 2);

// Conway's Game of Life

let grid;
let cols;
let rows;
let resolution = 1;
let fps = 24;
let seed = 2;
let seedlist = [];

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
    // frameRate(fps);
    createCanvas(W, H);
    cols = Math.ceil(W / resolution);
    rows = Math.ceil(H / resolution);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0

            let deg = (i * rows + j) / (cols * rows)
            let x = Math.cos(TWO_PI * deg);
            let y = Math.sin(TWO_PI * deg);
            seedlist.push([x, y]);
        }
    }

    seed += round(new Date().getTime() % W2) + 5;

    noStroke();
    background(0);
}

function draw() {
    background(0, 0, 0, 8);

    let next = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        let s = grid[i][H2 - 1] + grid[i][H2 - 3] + grid[i][H2 - 5];
        if (s > 1) {
            seed++;
        }
    }

    // console.log(seed);

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
        }
    }

    seedlist.map((xy) => {
        let x = round(xy[0] * seed + W2);
        let y = round(xy[1] * seed + H2);
        let state = grid[x][y];
        next[x][y] = !state
    })

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

    seed = 2;
}
