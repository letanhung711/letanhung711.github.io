let loopId = null;
let iconInterval = null;
let imageInterval = null;
let isRunning = false; // trạng thái đang chạy hiệu ứng

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let cw, ch;

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(aX, aY, bX, bY) {
  const dx = bX - aX;
  const dy = bY - aY;
  return Math.sqrt(dx * dx + dy * dy);
}

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = distance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 5;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 8;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if(this.targetRadius < 8) this.targetRadius += 0.3;
    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = distance(this.sx, this.sy, this.x + vx, this.y + vy);

    if(this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    // ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 0.7;
    this.hue = random(0, 360);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if(this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

// function dropFallingIcons(){
//   const icons = ['🍭', '🍰', '🎂', '🍦'];

//   const interval = setInterval(() => {
//     const icon = document.createElement('div');
//     icon.textContent = icons[Math.floor(Math.random()*icons.length)];
//     icon.style.position = 'fixed';
//     icon.style.left = `${Math.random()*100}vw`;
//     icon.style.bottom = `-5vh`;
//     icon.style.fontSize = `${Math.random()*2+1.5}rem`;
//     icon.style.pointerEvents = 'none';
//     icon.style.userSelect = 'none';
//     icon.style.zIndex = '9999';
//     icon.style.opacity = 0.9;

//     const duration = Math.random() * 2 + 3.5; // 2.5 - 4.5s
//     icon.style.animation = `rise ${duration}s ease-out forwards`;
//     document.body.appendChild(icon);

//     setTimeout(() => icon.remove(), duration * 1000);
//   }, 800); // chỉnh tốc độ xuất hiện
// }

function dropFallingIcons(){
  const imageSources = [
    './images/icons/1.gif',
    './images/icons/2.gif',
    './images/icons/3.gif',
    './images/icons/4.gif',
    './images/icons/5.gif',
    './images/icons/6.gif',
    './images/icons/7.gif'
  ];

  iconInterval = setInterval(() => {
    const img = document.createElement('img');
    img.src = imageSources[Math.floor(Math.random() * imageSources.length)];
    img.style.position = 'fixed';
    img.style.left = `${Math.random() * 100}vw`;
    img.style.bottom = `-6vh`;
    img.style.width = `${Math.random() * 50 + 50}px`; 
    //img.style.borderRadius = '15px';
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
    img.style.zIndex = '9999';
    img.style.opacity = 0.95;

    const duration = Math.random() * 2 + 4.5; // 2.5 - 4.5s
    img.style.animation = `rise ${duration}s ease-out forwards`;
    document.body.appendChild(img);

    setTimeout(() => img.remove(), duration * 1000);
  }, 1200);
}

function dropFallingImages(){
  const imageSources = [
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg'
  ];

  imageInterval = setInterval(() => {
    const img = document.createElement('img');
    img.src = imageSources[Math.floor(Math.random() * imageSources.length)];
    img.style.position = 'fixed';
    img.style.left = `${Math.random() * 100}vw`;
    img.style.bottom = `-6vh`;
    img.style.width = `${Math.random() * 60 + 60}px`; 
    img.style.borderRadius = '15px';
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
    img.style.zIndex = '9999';
    img.style.opacity = 0.95;

    const duration = Math.random() * 2 + 5.5; // 2.5 - 4.5s
    img.style.animation = `rise ${duration}s ease-out forwards`;
    document.body.appendChild(img);

    setTimeout(() => img.remove(), duration * 1000);
  }, 1400);
}


function createParticles(x, y) {
  let particleCount = 30;
  while(particleCount--) {
    particles.push(new Particle(x, y));
  }
}

let fireworks = [];
let particles = [];

function loop() {
  loopId = requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Làm mờ dần hiệu ứng
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';


  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if(fireworks.length < 5) {
    fireworks.push(new Firework(
      cw / 2,
      ch,
      random(100, cw - 100),
      random(50, ch / 2)
    ));
  }

}

function stopAllEffects() {
  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }
  if (iconInterval) {
    clearInterval(iconInterval);
    iconInterval = null;
  }
  if (imageInterval) {
    clearInterval(imageInterval);
    imageInterval = null;
  }
  isRunning = false;
}

function startAllEffects() {
  if (isRunning) return; // tránh chạy trùng nhiều lần

  loop();
  dropFallingIcons();
  dropFallingImages();
  isRunning = true;
}


//Check màn hình
function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const warning = document.getElementById('orientation-warning');
  const content = document.getElementById('main-content');

  if (isPortrait) {
    warning.style.display = 'flex';
    content.style.display = 'none';
    stopAllEffects(); //Dừng hiệu ứng khi xoay dọc
  } else {
    warning.style.display = 'none';
    content.style.display = 'block';
    startAllEffects();
  }
}

// Kiểm tra khi tải trang
window.addEventListener('load', checkOrientation);

// Kiểm tra khi xoay màn hình
window.addEventListener('resize', checkOrientation);