<script>
  import { onMount } from 'svelte';

  let containerEl;
  let canvas;
  let animId;
  let width = 0;
  let height = 160;

  let mouseX = -1000;
  let mouseY = -1000;

  // Rich flower garden configuration
  const flowers = [];
  const backdropGrass = [];

  const flowerStyles = [
    { type: 'rose', colors: ['#e11d48', '#ff2d55', '#ff4d6d'], petals: 8, radius: 10, center: '#ffd54f' },
    { type: 'daisy', colors: ['#ffffff', '#fff0f3', '#ffe4e6'], petals: 8, radius: 8.5, center: '#fbc02d' },
    { type: 'pinkBlossom', colors: ['#ff80ab', '#ff4081', '#f06292'], petals: 6, radius: 9, center: '#fff9c4' },
    { type: 'sunflower', colors: ['#ffd54f', '#ffca28', '#ffb300'], petals: 9, radius: 8, center: '#5d4037' },
    { type: 'lavender', colors: ['#ba68c8', '#ab47bc', '#ce93d8'], petals: 5, radius: 7.5, center: '#ffffff' },
    { type: 'tulip', colors: ['#ff1744', '#f50057', '#ff5252'], petals: 4, radius: 9.5, center: '#ffd54f' }
  ];

  function initGarden() {
    flowers.length = 0;
    backdropGrass.length = 0;

    const w = width || window.innerWidth || 400;

    // 1. Subtle soft background grass blades to support the flowers
    const grassCount = Math.floor(w / 5);
    for (let i = 0; i < grassCount; i++) {
      backdropGrass.push({
        x: (i / grassCount) * w + (Math.random() * 6 - 3),
        height: (height * 0.3) + Math.random() * (height * 0.35),
        width: 3.0 + Math.random() * 1.5,
        color: ['#4caf50', '#66bb6a', '#388e3c', '#81c784'][Math.floor(Math.random() * 4)],
        bendOffset: Math.random() * Math.PI * 2,
        bendSpeed: 0.8 + Math.random() * 0.4,
        maxBend: 10 + Math.random() * 12
      });
    }

    // 2. Dense, multi-layered flowers (60+ flowers across the bottom)
    const flowerCount = Math.max(35, Math.floor(w / 14));
    for (let i = 0; i < flowerCount; i++) {
      const style = flowerStyles[Math.floor(Math.random() * flowerStyles.length)];
      const color = style.colors[Math.floor(Math.random() * style.colors.length)];
      const layer = Math.random(); // 0 = back, 1 = front

      flowers.push({
        x: (i / flowerCount) * w + (Math.random() * 16 - 8),
        stemHeight: (height * 0.28) + layer * (height * 0.52) + (Math.random() * 16),
        style: style,
        color: color,
        centerColor: style.center,
        radius: style.radius * (0.8 + layer * 0.45),
        petals: style.petals,
        bendOffset: Math.random() * Math.PI * 2,
        bendSpeed: 0.9 + Math.random() * 0.45,
        maxBend: 12 + Math.random() * 10,
        leafSide: Math.random() > 0.5 ? 1 : -1,
        leafHeight: 0.35 + Math.random() * 0.35
      });
    }

    // Sort so back flowers render first and front flowers layer nicely
    flowers.sort((a, b) => a.stemHeight - b.stemHeight);
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth || document.documentElement.clientWidth || 400;
    height = Math.round(containerEl?.clientHeight || 160);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initGarden();
  }

  function handlePointer(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handlePointerLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  onMount(() => {
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointer, { passive: true });
    window.addEventListener('pointerup', handlePointerLeave, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });

    const ctx = canvas.getContext('2d');
    let time = 0;

    function render() {
      time += 0.024;
      ctx.clearRect(0, 0, width, height);

      // Soft green ground base
      const groundGrad = ctx.createLinearGradient(0, height - 30, 0, height);
      groundGrad.addColorStop(0, 'rgba(76, 175, 80, 0.45)');
      groundGrad.addColorStop(0.5, '#4caf50');
      groundGrad.addColorStop(1, '#2e7d32');

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 20);
      for (let x = 0; x <= width; x += 25) {
        const wave = Math.sin(x * 0.02 + time * 0.5) * 3;
        ctx.lineTo(x, height - 20 + wave);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = groundGrad;
      ctx.fill();

      // Soft background grass hints
      for (const blade of backdropGrass) {
        const wind = Math.sin(time * blade.bendSpeed + blade.bendOffset) * blade.maxBend;
        const tipX = blade.x + wind;
        const tipY = height - blade.height;
        const cpx = blade.x + wind * 0.4;
        const cpy = height - blade.height * 0.55;

        ctx.beginPath();
        ctx.moveTo(blade.x - blade.width * 0.5, height - 10);
        ctx.quadraticCurveTo(cpx, cpy, tipX, tipY);
        ctx.quadraticCurveTo(cpx + 1, cpy, blade.x + blade.width * 0.5, height - 10);
        ctx.fillStyle = blade.color;
        ctx.fill();
      }

      // Blooming Flowers Layer
      for (const flower of flowers) {
        let wind = Math.sin(time * flower.bendSpeed + flower.bendOffset) * flower.maxBend;

        // Interactive touch response: flowers bend away from touch
        const dist = Math.hypot(flower.x - mouseX, height - mouseY);
        if (dist < 110) {
          const push = (1 - dist / 110) * 38;
          wind += (flower.x > mouseX ? 1 : -1) * push;
        }

        const headX = flower.x + wind;
        const headY = height - flower.stemHeight;
        const cpx = flower.x + wind * 0.45;
        const cpy = height - flower.stemHeight * 0.5;

        // Green Stem
        ctx.beginPath();
        ctx.moveTo(flower.x, height - 8);
        ctx.quadraticCurveTo(cpx, cpy, headX, headY);
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Stem Leaf
        const leafY = height - flower.stemHeight * flower.leafHeight;
        const leafX = flower.x + wind * flower.leafHeight;
        ctx.beginPath();
        ctx.ellipse(
          leafX + flower.leafSide * 9,
          leafY,
          8,
          3.5,
          flower.leafSide * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#4caf50';
        ctx.fill();

        // Flower Blossom Head
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(wind * 0.04);

        // Petals Layer
        const petalAngleStep = (Math.PI * 2) / flower.petals;
        for (let p = 0; p < flower.petals; p++) {
          const angle = p * petalAngleStep;
          const px = Math.cos(angle) * (flower.radius * 0.7);
          const py = Math.sin(angle) * (flower.radius * 0.7);

          ctx.beginPath();
          ctx.ellipse(
            px,
            py,
            flower.radius * 0.65,
            flower.radius * 0.45,
            angle,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = flower.color;
          ctx.fill();

          // Petal edge highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Flower Center Core
        ctx.beginPath();
        ctx.arc(0, 0, flower.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = flower.centerColor;
        ctx.fill();

        // Flower Core Sparkle Dot
        ctx.beginPath();
        ctx.arc(-flower.radius * 0.1, -flower.radius * 0.1, flower.radius * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('pointerup', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
    };
  });
</script>

<div bind:this={containerEl} class="flower-garden-container" aria-hidden="true">
  <canvas
    bind:this={canvas}
    onpointermove={handlePointer}
    onpointerdown={handlePointer}
    onpointerleave={handlePointerLeave}
  ></canvas>
</div>

<style>
  /* Fixed Bottom Flower Garden across Page 1, Page 2, and Page 3 */
  .flower-garden-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: clamp(135px, 18vh, 185px);
    z-index: 15;
    overflow: hidden;
    pointer-events: none;
    filter: drop-shadow(0 -4px 12px rgba(233, 30, 99, 0.18));
    transform: translateZ(0);
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
