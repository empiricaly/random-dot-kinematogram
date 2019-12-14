# Random Dot Kinematogram

This package contains a React component for a [Random Dot
Kinematogram](http://www.georgemather.com/MotionDemos/RDKQT.html) (RDK) build
with the [P5 library](https://p5js.org/).

In RDKs, a certain percentage of dots are designated as “signal” to move in one
coherent direction, and the remaining percentage of dots are designated as
“noise” to move in random directions.

## Usage

Simply add the `<RDK>` component to your React tree.

```js
import RDK from "@empirica/random-dot-kinematogram";

//...

<RDK coherence={0.5} direction="right" />;
```

RDK expects 2 props:

- direction: "right" or "left" for the direction the signal
- coherence: a value between 0 (incoherent) and 1 (coherent) for the noise

## Credits

This package is based on the work of @josephbb. Thank you @josephbb for
allowing us to share your work with the community.
