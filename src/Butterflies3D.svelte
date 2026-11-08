<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let container;
  let renderer;
  let scene;
  let camera;
  let animId;

  let targetPos = new THREE.Vector3(0, 0, 0);
  let touchInfluence = 0;

  // Butterfly parameters
  const butterflyCount = 5;
  const butterflies = [];

  // Wing texture canvas generator
  function createWingTexture(baseColor, spotColor, outlineColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);

    // Left & Right wing drawing
    function drawWingHalf(isLeft) {
      ctx.save();
      ctx.translate(128, 128);
      if (isLeft) ctx.scale(-1, 1);

      // Main wing shape
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.bezierCurveTo(20, -70, 95, -110, 115, -75);
      ctx.bezierCurveTo(125, -50, 110, -10, 85, 5);
      ctx.bezierCurveTo(110, 35, 110, 85, 75, 105);
      ctx.bezierCurveTo(45, 115, 15, 75, 2, 20);
      ctx.closePath();

      // Wing gradient fill
      const grad = ctx.createRadialGradient(20, -10, 10, 70, 0, 100);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.85, spotColor);
      grad.addColorStop(1, outlineColor);
      ctx.fillStyle = grad;
      ctx.fill();

      // Wing borders and soft veins
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Fairy dots / spots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(80, -60, 5, 0, Math.PI * 2);
      ctx.arc(95, -35, 4.2, 0, Math.PI * 2);
      ctx.arc(68, 70, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    drawWingHalf(false); // Right wing
    drawWingHalf(true);  // Left wing

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Custom vertex shader for geometric 3D wing flapping
  const vertexShader = `
    uniform float uTime;
    uniform float uFlapSpeed;
    attribute float aPhase;
    attribute float aSize;

    varying vec2 vUv;
    varying float vSide;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Determine wing side (-1 for left, +1 for right)
      float side = sign(pos.x);
      vSide = side;

      // Wing flap angle using high-speed sine oscillation
      float angle = sin(uTime * uFlapSpeed + aPhase) * 0.95;

      // Flap rotation around spine (y-axis)
      float cosA = cos(angle * side);
      float sinA = sin(angle * side);

      // Rotate x and z for authentic 3D wing dihedral motion
      float newX = pos.x * cosA;
      float newZ = pos.z - abs(pos.x) * sinA * 0.55;

      // Add a slight aerodynamic ripple wave along wing length
      newZ += sin(uTime * uFlapSpeed * 1.2 + pos.y * 3.0) * 0.08 * abs(pos.x);

      pos.x = newX;
      pos.z = newZ;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader for glowing translucent wings
  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec3 uGlowColor;
    varying vec2 vUv;
    varying float vSide;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      if (texColor.a < 0.1) discard;

      // Soft fairy glow at wing edges
      vec3 finalColor = mix(texColor.rgb, uGlowColor, 0.22);
      gl_FragColor = vec4(finalColor, texColor.a * 0.95);
    }
  `;

  function initThree() {
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Butterfly themes matching Elizabeth's Disney Fairytale palette
    const butterflyThemes = [
      { base: '#ff2d55', spot: '#ff80ab', outline: '#880e4f', glow: new THREE.Color(1, 0.4, 0.7) },  // Fairytale Rose
      { base: '#ffd54f', spot: '#ff9800', outline: '#e65100', glow: new THREE.Color(1, 0.85, 0.3) }, // Monarch Gold
      { base: '#ba68c8', spot: '#e040fb', outline: '#4a148c', glow: new THREE.Color(0.8, 0.4, 1) },  // Royal Violet
      { base: '#00e5ff', spot: '#2979ff', outline: '#0d47a1', glow: new THREE.Color(0.3, 0.8, 1) },  // Cinderella Blue
      { base: '#ff4081', spot: '#ffd54f', outline: '#c2185b', glow: new THREE.Color(1, 0.5, 0.8) }   // Princess Pink
    ];

    // Create 3D butterflies - SMALL & PETITE
    for (let i = 0; i < butterflyCount; i++) {
      const theme = butterflyThemes[i % butterflyThemes.length];
      const texture = createWingTexture(theme.base, theme.spot, theme.outline);

      // Smaller, dainty butterfly plane geometry: 1.15 wide x 1.05 high
      const geom = new THREE.PlaneGeometry(1.15, 1.05, 8, 8);

      const aPhase = new Float32Array(geom.attributes.position.count);
      const aSize = new Float32Array(geom.attributes.position.count);
      const phase = Math.random() * Math.PI * 2;
      for (let j = 0; j < geom.attributes.position.count; j++) {
        aPhase[j] = phase;
        aSize[j] = 1.0;
      }
      geom.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
      geom.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uFlapSpeed: { value: 18.0 + Math.random() * 6.0 }, // Fast authentic flap speed
          uTexture: { value: texture },
          uGlowColor: { value: theme.glow }
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      // Distribute home centers across the entire screen width (from left -4.5 to right +4.5)
      const spreadX = ((i / (butterflyCount - 1)) - 0.5) * 8.5; // -4.25, -2.12, 0, 2.12, 4.25
      const startY = -4 + (i % 3) * 2.5;

      butterflies.push({
        mesh,
        material: mat,
        pos: new THREE.Vector3(spreadX, startY, (Math.random() - 0.5) * 3),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.02
        ),
        target: new THREE.Vector3(spreadX, startY, 0),
        centerX: spreadX,
        rangeX: 1.8 + Math.random() * 1.5,
        heightOffset: startY,
        speed: 0.035 + Math.random() * 0.02,
        flapSpeed: 18 + Math.random() * 6,
        orbitSpeed: 0.45 + Math.random() * 0.35,
        orbitOffset: i * (Math.PI * 2 / butterflyCount)
      });
    }
  }

  function handleResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function handlePointer(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    targetPos.set(x * 6.5, y * 5.5, 1);
    touchInfluence = 1.0; // momentary touch effect
  }

  onMount(() => {
    initThree();
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('pointerdown', handlePointer);

    let clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      butterflies.forEach((b, idx) => {
        b.material.uniforms.uTime.value = time;

        // Autonomous 3D flight paths spread evenly across the screen
        const flightTime = time * b.orbitSpeed + b.orbitOffset;
        const targetX = b.centerX + Math.sin(flightTime) * b.rangeX;
        const targetY = b.heightOffset + Math.sin(time * 1.2 + idx) * 1.6;
        const targetZ = Math.cos(flightTime * 0.9) * 2.0;

        b.target.set(targetX, targetY, targetZ);

        // Touch scatter: gently repels or dodges touch, then returns to natural path
        if (touchInfluence > 0.04) {
          const distToTouch = b.pos.distanceTo(targetPos);
          if (distToTouch < 4.0) {
            const push = b.pos.clone().sub(targetPos).normalize().multiplyScalar(touchInfluence * 0.03);
            b.vel.add(push);
          }
        }

        // Steer velocity toward target smoothly
        const steer = b.target.clone().sub(b.pos).multiplyScalar(0.016);
        b.vel.add(steer).clampLength(0.012, b.speed);
        b.pos.add(b.vel);

        // Update 3D mesh position
        b.mesh.position.copy(b.pos);

        // Bank and rotate towards direction of flight
        const lookTarget = b.pos.clone().add(b.vel);
        b.mesh.lookAt(lookTarget);

        // Natural flutter roll & tilt
        b.mesh.rotation.z += Math.sin(time * b.flapSpeed * 0.5) * 0.12;
      });

      // Decay touch influence so butterflies never get trapped anywhere
      touchInfluence *= 0.96;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handlePointer);
      if (animId) cancelAnimationFrame(animId);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }

      butterflies.forEach(b => {
        b.mesh.geometry.dispose();
        b.material.dispose();
      });
    };
  });
</script>

<div bind:this={container} class="butterflies-container" aria-hidden="true"></div>

<style>
  .butterflies-container {
    position: absolute;
    inset: 0;
    z-index: 24;
    pointer-events: none;
    overflow: hidden;
  }
</style>
