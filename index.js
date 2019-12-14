"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactP5Wrapper = _interopRequireDefault(require("react-p5-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Stimulus =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Stimulus, _React$Component);

  function Stimulus() {
    _classCallCheck(this, Stimulus);

    return _possibleConstructorReturn(this, _getPrototypeOf(Stimulus).apply(this, arguments));
  }

  _createClass(Stimulus, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          coherence = _this$props.coherence,
          direction = _this$props.direction;
      return _react["default"].createElement("div", {
        className: "stimulus"
      }, _react["default"].createElement(_reactP5Wrapper["default"], {
        sketch: Sketch,
        alpha: coherence,
        isRight: direction === "right",
        seed: 42,
        width: 300,
        height: 300
      }));
    }
  }]);

  return Stimulus;
}(_react["default"].Component);

exports["default"] = Stimulus;
Stimulus.defaultProps = {
  coherence: 1,
  direction: "right"
};
Stimulus.propTypes = {
  coherence: function coherence(props, propName, componentName) {
    var weight = props[propName];

    if (weight === undefined) {
      return new Error("coherence is required");
    }

    if (isNaN(weight)) {
      return new Error("coherence must be a number");
    }

    return weight >= 0 && weight <= 1 ? null : new Error("coherence must be within the range of 0 to 1");
  },
  direction: _propTypes["default"].oneOf(["left", "right"]).isRequired
};

function Sketch(p) {
  var seed = 0;
  var width = 0;
  var height = 0;
  var particles = [];
  var alpha = 0;
  var isRight = 0;
  var redraw = true;

  var Particle = function Particle(alpha, isRight) {
    this.alpha = alpha;
    this.isRight = isRight;
    var vx, vy;

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
    var vectorLength = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    var velocity = p.random(0.5, 2);
    vx = vx / vectorLength * velocity;
    vy = vy / vectorLength * velocity;
    this.accleration = p.createVector(0, 0);
    this.velocity = p.createVector(vx, vy);
    this.position = p.createVector(p.random(0, p.width), p.random(0, p.height));
    this.shuffle = 0.15 * (1 - this.alpha);
  };

  Particle.prototype.run = function () {
    this.display();
    this.update();
  };

  Particle.prototype.update = function () {
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

  Particle.prototype.display = function () {
    p.fill(255);
    p.stroke(0, 0);
    p.ellipse(this.position.x, this.position.y, p.width / 80, p.height / 80);
  };

  p.setup = function () {
    p.createCanvas(400, 400);

    for (var i = 0; i < 300; i++) {
      particles[i] = new Particle(alpha, 1);
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
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
      var diameter = p.height < p.width ? p.height : p.width;
      p.circle(diameter / 2, diameter / 2, diameter);
      p.fill(100);
      redraw = true;
    }

    if (redraw) {
      p.randomSeed(seed);

      for (var i = 0; i < 300; i++) {
        particles[i] = new Particle(alpha, isRight);
      }

      redraw = false;
    }
  };

  p.draw = function () {
    p.background(255, 255, 255);
    p.fill(100);
    var diameter = p.height < p.width ? p.height : p.width;
    p.circle(diameter / 2, diameter / 2, diameter);
    p.fill(100);

    for (var i = particles.length - 1; i >= 0; i--) {
      particles[i].run();
    }
  };
}
