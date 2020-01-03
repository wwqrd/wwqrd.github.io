---
title: Starfield
hype: /assets/images/sketchbook/starfield@2x.png
date: 2019-11-07
layout: sketch
---

<div class="fullscreen">
  <canvas id="view"></canvas>
</div>

<script type="text/javascript" src="/assets/js/lodash.min.js"></script>
<script type="text/javascript" src="/assets/js/ramda.min.js"></script>
<script type="text/javascript" src="/assets/js/dat.gui.min.js"></script>

<script type="text/javascript">
const DEBUG = false;
const TIMEOUT = 0;
const STARS = 1500;
const WARP_F = 15;

let rAF;
let gui;
let view;
let ctx;
let width;
let height;
let play;
let world = {
  warp: false,
};

const isOffscreen = (star) => {
  const zx = star.z * (star.x - 0.5);
  const zy = star.z * (star.y - 0.5);
  false;
  return zx > 0.5 || zx < -0.5 || zy > 0.5 || zy < -0.5;
};

let controls = {
  engage: () => {
    console.log('engage');
    clear();
    if (world.warp) {
      const stars = world.stars.filter(star => !isOffscreen);
      world.stars = [
        ...stars,
        ...genStars(STARS - stars.length),
      ];
    }

    world.warp = !world.warp;
  },
};

const genStar = (z) => {
  const x =  Math.random();
  const y =  Math.random();
  const vf = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
  return {
    x,
    y,
    z,
    v: vf * 0.0002 + 0.0003,
    s: Math.random() + 1,
    b: Math.random() * 0.9 + 0.5,
  };
};

const genStars = (quantity, z = -1) =>
  R.times(
    () => genStar(z === -1 ? Math.random() : z),
    quantity,
  )

const update = () => {
  const stars = world.stars
    .map((star) => {
      const zn = world.warp ?
        star.z + star.v * WARP_F :
        star.z + star.v;

      return {
        ...star,
        z: zn,
      };
    })
    .filter((star) => {
      if (world.warp) { return true; }
      return !isOffscreen(star);
    });

  const newStars = world.warp ?
    [] :
    genStars(STARS - world.stars.length, 0.1);

  world.stars = [...stars, ...newStars];
};

const getScreen = (p, z, space) => {
  const c = space/2;
  return (p - 0.5) * z * space + c;
};

const render = () => {
  world.stars.forEach((star) => {
    const x = getScreen(star.x, star.z, width);
    const y = getScreen(star.y, star.z, height);
    const s = star.s;
    const b = R.clamp(0, 1, Math.pow(star.z - 0.1, 2) * star.b);

    if (world.warp) {
      ctx.beginPath();
      ctx.lineWidth = star.s;
      ctx.strokeStyle = `rgba(255, 255, 255, ${b})`;
      ctx.moveTo(x, y);
      const x2 = getScreen(star.x, star.z + star.v * WARP_F, width);
      const y2 = getScreen(star.y, star.z + star.v * WARP_F, height);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${b})`;
      ctx.fillRect(x, y, s, s);
    }
  });
};

const clear = () => {
  if (!world.warp) {
    ctx.clearRect(0, 0, width, height);
    return;
  }
};

const filter = () => {
  if (world.warp) {
    ctx.fillStyle = `rgba(8, 8, 8, 0.001)`;
    ctx.fillRect(0, 0, width, height);
  }
};

const loop = () => {
  clear();
  update();
  render();
  filter();

  if (TIMEOUT !== -1) {
    rAF = window.requestAnimationFrame(loop);
  }
};

const start = () => {
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
}

const setup = () => {
  view = document.getElementById('view');
  ctx = view.getContext('2d');

  width = window.innerWidth;
  height = window.innerHeight;

  view.style.width = width + 'px';
  view.style.height = height + 'px';
  ctx.canvas.width  = width;
  ctx.canvas.height = height;

  world.stars = genStars(STARS);
};

gui = new dat.GUI();
gui.add(controls, 'engage');

const main = () => {
  stop();
  setup();
  start();
}

main()

window.addEventListener('resize', _.debounce(main, 200));
</script>
