<script>
  import { onMount } from 'svelte';

  let containerEl;
  let canvas;
  let width = 0;
  let height = 150;

  // Rich flower garden configuration
  const flowers = [];
  const backdropGrass = [];

  const flowerStyles = [
    { type: 'rose', colors: ['#e11d48', '#ff2d55', '#ff4d6d'], petals: 8, radius: 9, center: '#ffd54f' },
    { type: 'daisy', colors: ['#ffffff', '#fff0f3', '#ffe4e6'], petals: 8, radius: 8, center: '#fbc02d' },
    { type: 'pinkBlossom', colors: ['#ff80ab', '#ff4081', '#f06292'], petals: 6, radius: 8.5, center: '#fff9c4' },
    { type: 'sunflower', colors: ['#ffd54f', '#ffca28', '#ffb300'], petals: 9, radius: 7.5, center: '#5d4037' },
    { type: 'lavender', colors: ['#ba68c8', '#ab47bc', '#ce93d8'], petals: 5, radius: 7, center: '#ffffff' },
    { type: 'tulip', colors: ['#ff1744', '#f50057', '#ff5252'], petals: 4, radius: 8.5, center: '#ffd54f' }
  ];

  function initGarden() {
    flowers.length = 0;
    backdropGrass.length = 0;

    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 400) || 400;

    // 1. Soft background grass blades
    const grassCount = Math.min(32, Math.floor(w / 12));
    for (let i = 0; i < grassCount; i++) {
      backdropGrass.push({
        x: (i / grassCount) * w + (Math.random() * 8 - 4),
        height: (height * 0.3) + Math.random() * (height * 0.35),
        width: 3.0 + Math.random() * 1.5,
        color: ['#4caf50', '#66bb6a', '#388e3c', '#81c784'][i % 4],
        bend: (Math.random() * 14 - 7)
      });
    }

    // 2. Beautiful flowers (optimized count)
    const flowerCount = Math.min(28, Math.max(16, Math.floor(w / 15)));
    for (let i = 0; i < flowerCount; i++) {
      const style = flowerStyles[i % flowerStyles.length];
      const color = style.colors[i % style.colors.length];
      const layer = Math.random();

      flowers.push({
        x: (i / flowerCount) * w + (Math.random() * 12 - 6),
        stemHeight: (height * 0.28) + layer * (height * 0.5) + (Math.random() * 12),
        style: style,
        color: color,
        centerColor: style.center,
        radius: style.radius * (0.8 + layer * 0.35),
        petals: style.petals,
        bend: (Math.random() * 16 - 8),
        leafSide: i % 2 === 0 ? 1 : -1,
        leafHeight: 0.35 + Math.random() * 0.3
      });
    }

    flowers.sort((a, b) => a.stemHeight - b.stemHeight);
  }

  function drawGarden(touchX = -1000) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Soft green ground base
    const groundGrad = ctx.createLinearGradient(0, height - 26, 0, height);
    groundGrad.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
    groundGrad.addColorStop(0.5, '#4caf50');
    groundGrad.addColorStop(1, '#2e7d32');

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 18);
    for (let x = 0; x <= width; x += 30) {
      ctx.lineTo(x, height - 18 + Math.sin(x * 0.03) * 2.5);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = groundGrad;
    ctx.fill();

    // Grass
    for (const blade of backdropGrass) {
      let bend = blade.bend;
      const tipX = blade.x + bend;
      const tipY = height - blade.height;
      const cpx = blade.x + bend * 0.4;
      const cpy = height - blade.height * 0.55;

      ctx.beginPath();
      ctx.moveTo(blade.x - blade.width * 0.5, height - 8);
      ctx.quadraticCurveTo(cpx, cpy, tipX, tipY);
      ctx.quadraticCurveTo(cpx + 1, cpy, blade.x + blade.width * 0.5, height - 8);
      ctx.fillStyle = blade.color;
      ctx.fill();
    }

    // Flowers
    for (const flower of flowers) {
      let bend = flower.bend;
      if (touchX > 0) {
        const dist = Math.abs(flower.x - touchX);
        if (dist < 90) {
          const push = (1 - dist / 90) * 28;
          bend += (flower.x > touchX ? 1 : -1) * push;
        }
      }

      const headX = flower.x + bend;
      const headY = height - flower.stemHeight;
      const cpx = flower.x + bend * 0.45;
      const cpy = height - flower.stemHeight * 0.5;

      // Stem
      ctx.beginPath();
      ctx.moveTo(flower.x, height - 6);
      ctx.quadraticCurveTo(cpx, cpy, headX, headY);
      ctx.strokeStyle = '#388e3c';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Leaf
      const leafY = height - flower.stemHeight * flower.leafHeight;
      const leafX = flower.x + bend * flower.leafHeight;
      ctx.beginPath();
      ctx.ellipse(leafX + flower.leafSide * 7, leafY, 6.5, 3, flower.leafSide * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#4caf50';
      ctx.fill();

      // Flower Head
      ctx.save();
      ctx.translate(headX, headY);

      // Petals
      const petalAngleStep = (Math.PI * 2) / flower.petals;
      for (let p = 0; p < flower.petals; p++) {
        const angle = p * petalAngleStep;
        const px = Math.cos(angle) * (flower.radius * 0.7);
        const py = Math.sin(angle) * (flower.radius * 0.7);
        ctx.beginPath();
        ctx.arc(px, py, flower.radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = flower.color;
        ctx.fill();
      }

      // Center
      ctx.beginPath();
      ctx.arc(0, 0, flower.radius * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = flower.centerColor;
      ctx.fill();

      ctx.restore();
    }
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth || document.documentElement.clientWidth || 400;
    height = Math.round(containerEl?.clientHeight || 150);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initGarden();
    drawGarden();
  }

  let touchTimeout;
  function handlePointer(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    drawGarden(touchX);

    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      drawGarden();
    }, 280);
  }

  onMount(() => {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(touchTimeout);
    };
  });
</script>

<div 
  bind:this={containerEl} 
  class="grass-fixed-container" 
  onpointerdown={handlePointer}
  role="region"
  aria-label="Flower Garden"
>
  <canvas bind:this={canvas} class="grass-canvas"></canvas>
</div>

<style>
  .grass-fixed-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 125px;
    z-index: 20;
    pointer-events: auto;
    overflow: hidden;
    contain: strict;
    transform-origin: bottom center;
    animation: gentleBreeze 6s ease-in-out infinite alternate;
  }

  @keyframes gentleBreeze {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-1.2px) rotate(0.35deg); }
    100% { transform: translateY(0px) rotate(-0.25deg); }
  }

  .grass-canvas {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    touch-action: pan-y;
  }
</style>
