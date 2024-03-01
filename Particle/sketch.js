/*
Using P5.js Generate several swarms of particles, each with a different behavior.
Each swarm should have a different color and behavior.
The particles should be drawn as circles on the canvas.
The particles should be repelled and attracted to each other.
*/


// Path: Particle/particle.js

class Particle {
    constructor(x, y, color, attraction, repulsion) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.color = color;
        this.attraction = attraction;
        this.repulsion = repulsion;
        this.maxSpeed = 1;
        this.maxForce = 0.2;
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    edges() {
        if (this.pos.x > width) {
            this.pos.x = 0;
        } else if (this.pos.x < 0) {
            this.pos.x = width;
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
        } else if (this.pos.y < 0) {
            this.pos.y = height;
        }
    }

    show() {
        stroke(colors[this.color].r, colors[this.color].g, colors[this.color].b);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
    }

    distance(a, b) {
        if(Math.abs(a.x - b.x) > W2) {
            b.x -= W;
        }
        if(Math.abs(a.y - b.y) > H2) {
            b.y -= H;
        }
        // if (b.x > W * 0.5) {
        //     b.x -= W;
        // }
        // if (b.x < W * -0.5) {
        //     b.x += W;
        // }
        // if (b.y > H * 0.5) {
        //     b.y -= H;
        // }
        // if (b.y < H * -0.5) {
        //     b.y += H;
        // }
        return dist(a.x, a.y, b.x, b.y);
    }

    // repel should be stronger at close distances and weaker at far distances and should accommodate for edge wrapping
    repel(particles) {
        let steering = createVector();
        for (let other of particles) {
            let d = this.distance(this.pos, other.pos);
            if (other != this && d < this.repulsion && d > 0) {
                let diff = p5.Vector.sub(this.pos, other.pos);
                diff.div(d);
                steering.add(diff);
            }
        }
        this.acc.add(steering);
    }

    // attract should be stronger at far distances and weaker at close distances and should accommodate for edge wrapping
    attract(particles) {
        let steering = createVector();
        for (let other of particles) {
            let d = this.distance(this.pos, other.pos);
            if (other != this && d < this.attraction && d > 10) {
                let diff = p5.Vector.sub(this.pos, other.pos);
                diff.div(d);
                steering.sub(diff);
            }
        }
        this.acc.add(steering);
    }

    // align should steer towards the average heading of all particles
    align(particles) {
        let steering = createVector();
        for (let other of particles) {
            if (other != this) {
                steering.add(other.vel);
            }
        }
        steering.div(particles.length);
        steering.sub(this.vel);
        this.acc.add(steering);
    }


}

// Path: Particle/sketch.js

const W = 600;
const H = 600;
const W2 = W / 2;
const H2 = H / 2;
const totalParticles = 1000;
let swarms = [];
let numSwarms = 5;
let particles = [];
let numParticles = Math.floor(totalParticles / numSwarms);
let colors = [];
for (let i = 0; i < numSwarms; i++) {
    colors.push(
        {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: 127,
        }
    );
}

function setup() {
    createCanvas(W, H);
    for (let i = 0; i < numSwarms; i++) {
        let swarm = { particles: [] };
        let color = i;
        let attraction = random(W / 4);
        let repulsion = random(W / 4);
        for (let j = 0; j < numParticles; j++) {
            let x = random(width);
            let y = random(height);
            let particle = new Particle(x, y, color, attraction, repulsion);
            swarm.particles.push(particle);
        }
        swarms.push(swarm);
    }
    console.log(swarms);
}

function draw() {
    background(0, 0, 0, 16);
    for (let i = 0; i < swarms.length; i++) {
        let swarm = swarms[i];
        let particles = swarm.particles;
        particles.forEach(particle => {
            particle.repel(particles);
            particle.attract(particles);
            // particle.align(particles);
            particle.update();
            particle.edges();
        });
    }
    for (let i = 0; i < swarms.length; i++) {
        let swarm = swarms[i];
        let particles = swarm.particles;
        particles.forEach(particle => {
            particle.show();
        });
    }
    // noLoop();  
}