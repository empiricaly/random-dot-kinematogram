import React from "react";
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";

export default class Stimulus extends React.Component {
  render() {
    const { coherence, direction } = this.props;

    return (
      <div className="stimulus">
        <P5Wrapper
          sketch={Sketch}
          alpha={coherence}
          isRight={direction === "right"}
          seed={42}
          width={300}
          height={300}
        />
      </div>
    );
  }
}

Stimulus.defaultProps = {
  coherence: 1,
  direction: "right"
};

Stimulus.propTypes = {
  coherence: function(props, propName, componentName) {
    let weight = props[propName];

    if (weight === undefined) {
      return new Error("coherence is required");
    }

    if (isNaN(weight)) {
      return new Error("coherence must be a number");
    }

    return weight >= 0 && weight <= 1
      ? null
      : new Error("coherence must be within the range of 0 to 1");
  },
  direction: PropTypes.oneOf(["left", "right"]).isRequired
};

function Sketch(p) {
  let seed = 0;
  let width = 0;
  let height = 0;
  let particles = [];
  let alpha = 0;
  let isRight = 0;
  let redraw = true;

  let Particle = function(alpha, isRight) {
    this.alpha = alpha;
    this.isRight = isRight;
    let vx, vy;
    if (p.random() < this.alpha) {
      vx = this.isRight * 1 + (1 - this.isRight) * -1;
    } else {
      if (p.random() < 0.5) {
        vx = 1;
      } else {
        vx = -1;
      }
    }
    vx = vx + p.random(-0.5, 0.5);
    vy = p.random(-1, 1) * (1 - alpha);

    const vectorLength = Math.sqrt(vx ** 2 + vy ** 2);
    const velocity = p.random(0.5, 2);
    vx = (vx / vectorLength) * velocity;
    vy = (vy / vectorLength) * velocity;

    this.accleration = p.createVector(0, 0);
    this.velocity = p.createVector(vx, vy);
    this.position = p.createVector(p.random(0, p.width), p.random(0, p.height));
    this.shuffle = 0.15 * (1 - this.alpha);
  };

  Particle.prototype.run = function() {
    this.display();
    this.update();
  };

  Particle.prototype.update = function() {
    if (this.position.x < 0) {
      this.position.x += p.width;
    }
    if (this.position.x > p.width) {
      this.position.x -= p.width;
    }
    if (this.position.y < 0) {
      this.position.y += p.height;
    }
    if (this.position.y > p.height) {
      this.position.y -= p.height;
    }
    if (p.random() < this.shuffle) {
      this.position.x = p.random(0, p.width);
      this.position.y = p.random(0, p.height);
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  };

  Particle.prototype.display = function() {
    p.fill(255);
    p.stroke(0, 0);
    p.ellipse(this.position.x, this.position.y, p.width / 80, p.height / 80);
  };

  p.setup = function() {
    p.createCanvas(400, 400);
    for (let i = 0; i < 300; i++) {
      particles[i] = new Particle(alpha, 1);
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.alpha !== alpha) {
      alpha = props.alpha;
      redraw = true;
    }

    if (props.isRight !== isRight) {
      isRight = props.isRight;
      redraw = true;
    }

    if (props.seed !== seed) {
      seed = props.seed;
      redraw = true;
    }

    if (props.width !== width || props.height !== height) {
      width = props.width;
      height = props.height;

      p.resizeCanvas(width, height);
      p.background(255, 255, 255);
      p.fill(100);
      const diameter = p.height < p.width ? p.height : p.width;
      p.circle(diameter / 2, diameter / 2, diameter);
      p.fill(100);
      redraw = true;
    }

    if (redraw) {
      p.randomSeed(seed);

      for (let i = 0; i < 300; i++) {
        particles[i] = new Particle(alpha, isRight);
      }
      redraw = false;
    }
  };

  p.draw = function() {
    p.background(255, 255, 255);
    p.fill(100);
    const diameter = p.height < p.width ? p.height : p.width;
    p.circle(diameter / 2, diameter / 2, diameter);
    p.fill(100);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].run();
    }
  };
}
