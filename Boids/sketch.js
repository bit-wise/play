const W = window.innerWidth;
const H = window.innerHeight;
let boids = [];

let alignSlider, cohesionSlider, separationSlider, trailSlider, edgeAvoidanceSlider;

class Boid {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.rgb = color(
            random(127) + random(127),
            random(127) + random(127),
            random(127) + random(127)
        );
        this.perceptionRadius = random(127 * 2) + random(127);
        this.size = (this.perceptionRadius ** (1 / 2));
        this.maxsize = 0;
    }

    edges() {
        if (this.position.x > W) {
            this.position.x = 0;
        }
        if (this.position.x < 0) {
            this.position.x = W;
        }
        if (this.position.y > H) {
            this.position.y = 0;
        }
        if (this.position.y < 0) {
            this.position.y = H;
        }
    }

    align(averageVelocity) {
        let steering = createVector();
        steering.add(averageVelocity);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
        return steering;
    }

    cohesion(averagePosition) {
        let steering = createVector();
        steering.add(averagePosition);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
        return steering;
    }

    separation(boids) {
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < this.perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    avoidEdges() {
        let steering = createVector();
        let edgeDistance = 5;

        if (this.position.x < edgeDistance) {
            steering.x += 1;
        } else if (this.position.x > width - edgeDistance) {
            steering.x -= 1;
        }

        if (this.position.y < edgeDistance) {
            steering.y += 1;
        } else if (this.position.y > height - edgeDistance) {
            steering.y -= 1;
        }

        steering.sub(this.velocity);
        steering.limit(this.maxForce);
        return steering;
    }

    flock(boids, averagePosition, averageVelocity) {
        let alignment = this.align(averageVelocity);
        let cohesion = this.cohesion(averagePosition);
        let separation = this.separation(boids);
        let avoidEdges = this.avoidEdges();

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());
        avoidEdges.mult(edgeAvoidanceSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        this.acceleration.add(avoidEdges);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(this.size + 9);
        stroke(0, 0, 0, 8);
        point(this.position.x, this.position.y);

        strokeWeight(this.size + 3);
        stroke(this.rgb);
        point(this.position.x, this.position.y);
    }
}

function setup() {
    for (let i = 0; i < Math.pow(2, 8); i++) {
        let b = new Boid(random(W), random(H));
        boids.push(b);
    }
    alignSlider = createSlider(0, 1, 0, 0.1);
    cohesionSlider = createSlider(0, 1, 0, 0.1);
    separationSlider = createSlider(0, 1, 1, 0.1);
    edgeAvoidanceSlider = createSlider(0, 1, 0, 0.1);
    trailSlider = createSlider(0, 128, 0, 1);

    createCanvas(W, H);
    background(0)
}

function draw() {
    background(0, 0, 0, trailSlider.value());

    let averagePosition = createVector(0, 0);
    let averageVelocity = createVector(0, 0);
    for (let boid of boids) {
        averagePosition.add(boid.position);
        averageVelocity.add(boid.velocity);
    }
    averagePosition.div(boids.length);
    averageVelocity.div(boids.length);

    for (let boid of boids) {
        boid.edges();
        boid.flock(boids, averagePosition, averageVelocity);
        boid.update();
        boid.show();
    }
}