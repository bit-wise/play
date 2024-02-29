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

    // repel should be stronger at close distances and weaker at far distances
    // attract should be stronger at far distances and weaker at close distances
    repel(particles) {
        let repulsion = this.repulsion;
        let repulsionForce = createVector();
        particles.forEach(particle => {
            if (particle === this) return;
            // get the minimum distance between the two particles and compensate for edge wrapping
            let d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
            if (d > 50 && d < 100) {
                let force = p5.Vector.sub(this.pos, particle.pos);
                force.setMag(repulsion / d);
                repulsionForce.add(force);
            } else
            if (d < 10) {
                let force = p5.Vector.sub(this.pos, particle.pos);
                force.setMag(0.5);
                repulsionForce.add(force);
            }
            this.acc.add(repulsionForce);
        });
    }

    attract(particles) {
        let attraction = this.attraction;
        let attractionForce = createVector();
        particles.forEach(particle => {
            if (particle === this) return;
            let d;
            // d = min(
            //     dist(this.pos.x, this.pos.y, particle.pos.x - width, particle.pos.y - height),
            //     dist(this.pos.x, this.pos.y, particle.pos.x - width, particle.pos.y),
            //     dist(this.pos.x, this.pos.y, particle.pos.x - width, particle.pos.y + height),
            //     dist(this.pos.x, this.pos.y, particle.pos.x + width, particle.pos.y - height),
            //     dist(this.pos.x, this.pos.y, particle.pos.x + width, particle.pos.y),
            //     dist(this.pos.x, this.pos.y, particle.pos.x + width, particle.pos.y + height),
            //     dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y - height),
            //     dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y),
            //     dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y + height)
            // );
            d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
            if (d > 20 && d < 50) {
                let force = p5.Vector.sub(particle.pos, this.pos);
                force.setMag(attraction / d);
                attractionForce.add(force);
            }
        });
        this.acc.add(attractionForce);
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
        stroke(this.color.r, this.color.g, this.color.b);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
    }
}

// Path: Particle/sketch.js

const W = 600;
const H = 600;
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
        let swarm = {particles: []};
        let color = colors[i];
        let attraction = random(W/3);
        let repulsion = random(W/3);
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
    background(0,0,0,16);
    for (let i = 0; i < swarms.length; i++) {
        let swarm = swarms[i];
        let particles = swarm.particles;
        particles.forEach(particle => {
            particle.repel(particles);
            // particle.attract(particles);
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