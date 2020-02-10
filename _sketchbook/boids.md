---
title: Boids
hype: /assets/images/sketchbook/boids@2x.png
date: 2019-10-15
layout: sketch
---

<div class="fullscreen">
  <canvas id="view"></canvas>
</div>

<script type="text/javascript" src="/assets/js/lodash.min.js"></script>
<script type="text/javascript" src="/assets/js/ramda.min.js"></script>
<script type="text/javascript" src="/assets/js/dat.gui.min.js"></script>
<script type="text/javascript" src="/assets/js/gpu-browser.min.js"></script>

<script type="text/javascript">
/*
TODO:
- move walls off screen
- better styles
- better clear function
*/

const DEBUG = false;
const BOIDS = 300;
const TIMEOUT = 0;
const BORDER = 100;
const C = 2.1;
const M = 1.9;
const F = 0.99;

let view;
let ctx;
let width;
let height;
let play;
let distances;
let yMin;
let yMax;
let xMin;
let xMax;
let rAF;
let computeForces;
let gpu;
let world;

function applyForces(things) {
  let y = things[this.thread.x][0];
  let x = things[this.thread.x][1];

  let dy = things[this.thread.x][2] + Math.random() * 0.2 - 0.1;
  let dx = things[this.thread.x][3] + Math.random() * 0.2 - 0.1;
  dy *= this.constants.F;
  dx *= this.constants.F;

  let countAlign = 0;
  let alignY = 0;
  let alignX = 0;
  let countCenter = 1;
  let centerX = x;
  let centerY = y;
  let countAvoid = 1;
  let avoidX = x;
  let avoidY = y;

  for (let i = 0; i < this.constants.size; i++) {
    if (i !== this.thread.x) {
      const x2 = things[i][1];
      const y2 = things[i][0];
      const d = Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2);

      if (d < 5000) {
        countAlign += 1;
        alignY += things[i][2];
        alignX += things[i][3];
      }

      if (d < 1000 && d > 4000) {
        countCenter += 1;
        centerY += y2;
        centerX += x2;
      }

      if (d < 2000) {
        countAvoid += 1;
        avoidY += y2;
        avoidX += x2;
      }
    }
  }

  if (countAlign > 0) {
    dy += (alignY / countAlign) * 0.03;
    dx += (alignX / countAlign) * 0.03;
  }

  if (countCenter > 0) {
    dy += (y - (centerY / countCenter)) * 0.004;
    dx += (x - (centerX / countCenter)) * 0.004;
  }

  if (countAvoid > 0) {
    dy += (y - (avoidY / countAvoid)) * 0.004;
    dx += (x - (avoidX / countAvoid)) * 0.004;
  }

  const hW = this.constants.width / 2;
  const hH = this.constants.height / 2;

  dy += (hH - y)/hH * 0.002;
  dx += (hW - x)/hW * 0.002;

  const velocity = Math.pow(dy, 2) + Math.pow(dx, 2);

  if (velocity > this.constants.C) {
    const t = Math.atan2(dy, dx);
    dy = Math.sin(t) * this.constants.C;
    dx = Math.cos(t) * this.constants.C;
  }

  if (velocity < this.constants.M) {
    const t = Math.atan2(dy, dx);
    dy = Math.sin(t) * this.constants.M;
    dx = Math.cos(t) * this.constants.M;
  }

  if (y + dy < -this.constants.BORDER || y + dy > this.constants.height + this.constants.BORDER) {
    dy *= -1;
  }

  if (x + dx < -this.constants.BORDER || x + dx > this.constants.width + this.constants.BORDER) {
    dx *= -1;
  }

  y = Math.min(
    this.constants.height + this.constants.BORDER,
    Math.max(-this.constants.BORDER, dy + y),
  );
  x = Math.min(
    this.constants.width + this.constants.BORDER,
    Math.max(-this.constants.BORDER, dx + x),
  );

  return [
    y,
    x,
    dy,
    dx,
  ];
}



// Get pixel
const px = (x) => x;
const py = (y) => y;

const update = () => {
  // console.log(distances.toArray());
  world.things = computeForces(world.things);
};

const renderBoid = ([y, x, dy, dx]) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px(x), py(y));
  ctx.lineTo(px(x) + dx * 3, py(y) + dy * 3);
  ctx.stroke();
};

const renderThing = (thing) => {
  renderBoid(thing);
};

const render = () => {
  world.things.forEach(renderThing);
};

const clearThing = ([y, x, dy, dx]) => {
  ctx.clearRect(x-5, y-5, 10, 10);
}

const clear = () => {
  ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
  ctx.fillRect(0, 0, width, height);
  // world.things.forEach(clearThing);
};

const loop = () => {
  clear();
  update();
  render();

  if (TIMEOUT !== -1) {
    rAF = window.requestAnimationFrame(loop);
  }
};

const start = () => {
  console.log('start');
  play = true;
  loop();

  if (TIMEOUT > 0) {
    setTimeout(() => {
      stop();
    }, TIMEOUT);
  }
};

const stop = () => {
  window.cancelAnimationFrame(rAF);
  if (computeForces) {
	  computeForces.destroy();
  }
  console.log('stop');
}

const setup = () => {
  console.log('setup');
  view = document.getElementById('view');
  ctx = view.getContext('2d');

  gpu = new GPU({
    // mode: 'cpu',
    // mode: 'webgl2',
  });

  width = window.innerWidth;
  height = window.innerHeight;

  view.style.width = width + 'px';
  view.style.height = height + 'px';
  ctx.canvas.width  = width;
  ctx.canvas.height = height;

  world = {
    things: [],
  };

  world.things = world.things.concat(
    R.times(() => ([
      Math.random() * height, // y
      Math.random() * width, // x
      Math.random() * 3 - 1.5, // dy
      Math.random() * 3 - 1.5, // dx
      // 'boid', // type
    ]), BOIDS),
  );

  computeForces = gpu.createKernel(applyForces)
    .setOutput([
      world.things.length,
    ])
    .setConstants({
      size: world.things.length,
      C,
      M,
      F,
      BORDER,
      width,
      height,
    });
};

stop();
setup();
start();



</script>
