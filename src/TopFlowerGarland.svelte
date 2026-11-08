<script>
  import Icon from '@iconify/svelte';
  import './flowerIcons.js';

  // Garland flower canopy items positioned across the top arch
  const canopyFlowers = [
    // Left cluster
    { id: 'f-left-1', icon: 'fluent-emoji:rose', sizeMultiplier: 1.05, left: 4, top: -2 },
    { id: 'f-left-herb', icon: 'fluent-emoji:herb', sizeMultiplier: 0.88, left: 12, top: 0 },
    { id: 'f-left-2', icon: 'fluent-emoji:cherry-blossom', sizeMultiplier: 0.95, left: 21, top: 6 },
    { id: 'f-left-3', icon: 'fluent-emoji:blossom', sizeMultiplier: 0.9, left: 31, top: 12 },
    { id: 'f-left-4', icon: 'fluent-emoji:tulip', sizeMultiplier: 0.95, left: 40, top: 18 },

    // Center cluster (Crowning Arch)
    { id: 'f-center-rose', icon: 'fluent-emoji:rose', sizeMultiplier: 1.25, left: 50, top: 20, isCenter: true },
    { id: 'f-center-sparkle', icon: 'fluent-emoji:sparkles', sizeMultiplier: 0.65, left: 50, top: -2 },

    // Right cluster
    { id: 'f-right-4', icon: 'fluent-emoji:hibiscus', sizeMultiplier: 0.95, left: 60, top: 18 },
    { id: 'f-right-3', icon: 'fluent-emoji:blossom', sizeMultiplier: 0.9, left: 69, top: 12 },
    { id: 'f-right-2', icon: 'fluent-emoji:cherry-blossom', sizeMultiplier: 0.95, left: 79, top: 6 },
    { id: 'f-right-herb', icon: 'fluent-emoji:herb', sizeMultiplier: 0.88, left: 88, top: 0 },
    { id: 'f-right-1', icon: 'fluent-emoji:rose', sizeMultiplier: 1.05, left: 96, top: -2 }
  ];
</script>

<div class="top-garland-root" aria-hidden="true">
  <!-- Swaying Botanical Garland Canopy Frame -->
  <div class="garland-sway-bar">
    <!-- Arching Vine Canopy Layer Behind Flowers -->
    <svg viewBox="0 0 1200 135" preserveAspectRatio="none" class="vine-backdrop-svg">
      <defs>
        <linearGradient id="garland-vine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2e7d32" />
          <stop offset="30%" stop-color="#388e3c" />
          <stop offset="50%" stop-color="#4caf50" />
          <stop offset="70%" stop-color="#388e3c" />
          <stop offset="100%" stop-color="#2e7d32" />
        </linearGradient>
        <filter id="garland-shadow" x="-5%" y="-5%" width="110%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#880e4f" flood-opacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#garland-shadow)">
        <path d="M-20,-5 Q300,72 600,44 T1220,-5" fill="none" stroke="url(#garland-vine-grad)" stroke-width="6" stroke-linecap="round" />
        <path d="M-10,12 Q320,90 600,56 T1210,12" fill="none" stroke="#1b5e20" stroke-width="4" stroke-linecap="round" opacity="0.85" />
      </g>
    </svg>

    <!-- Hanging Corner Drops (Pendulum wind swing) -->
    <!-- Left Hanging Floral Tendril -->
    <div class="hanging-corner corner-left">
      <div class="tendril-stem"></div>
      <div class="corner-flora corner-flora-1">
        <Icon icon="fluent-emoji:herb" width={28} height={28} />
      </div>
      <div class="corner-flora corner-flora-2">
        <Icon icon="fluent-emoji:cherry-blossom" width={26} height={26} />
      </div>
      <div class="corner-flora corner-flora-3">
        <Icon icon="fluent-emoji:sparkles" width={18} height={18} />
      </div>
    </div>

    <!-- Right Hanging Floral Tendril -->
    <div class="hanging-corner corner-right">
      <div class="tendril-stem"></div>
      <div class="corner-flora corner-flora-1">
        <Icon icon="fluent-emoji:herb" width={28} height={28} />
      </div>
      <div class="corner-flora corner-flora-2">
        <Icon icon="fluent-emoji:blossom" width={26} height={26} />
      </div>
      <div class="corner-flora corner-flora-3">
        <Icon icon="fluent-emoji:sparkles" width={18} height={18} />
      </div>
    </div>

    <!-- Main Botanical Flower Canopy along Top Arch -->
    <div class="canopy-flower-row">
      {#each canopyFlowers as item (item.id)}
        <div 
          class="canopy-flower-node {item.anim}"
          class:center-bloom={item.isCenter}
          style="
            left: {item.left}%; 
            top: {item.top}px; 
            animation-delay: {item.delay}s;
            --size-mult: {item.sizeMultiplier || 1};
          "
        >
          <div class="flower-wrapper">
            <Icon icon={item.icon} width="100%" height="100%" />
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Fixed Top Floral Garden Canopy across Homescreen and Church Page */
  .top-garland-root {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 38;
  }

  /* Swaying Canopy Header Bar */
  .garland-sway-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: clamp(86px, 14vh, 126px);
    pointer-events: none;
    overflow: visible;
    transform-origin: 50% 0%;
    transform: translateZ(0);
    animation: dynamicCanopySway 5.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
  }

  /* Backdrop Arch Vine */
  .vine-backdrop-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
  }

  /* Flower Row along the arch */
  .canopy-flower-row {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
  }

  .canopy-flower-node {
    position: absolute;
    transform: translate(-50%, 0);
    will-change: transform;
    pointer-events: none;
  }

  .flower-wrapper {
    width: calc(clamp(32px, 8.8vw, 46px) * var(--size-mult, 1));
    height: calc(clamp(32px, 8.8vw, 46px) * var(--size-mult, 1));
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 4px 10px rgba(190, 18, 60, 0.28));
    transition: transform 0.2s ease;
  }

  .center-bloom .flower-wrapper {
    filter: drop-shadow(0 6px 14px rgba(225, 29, 72, 0.45));
  }

  /* Hanging Corner Tendrils (Physical Pendulums) */
  .hanging-corner {
    position: absolute;
    top: 10px;
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    will-change: transform;
  }

  .corner-left {
    left: 14px;
    transform-origin: top center;
    animation: swingTendrilLeft 3.6s ease-in-out infinite alternate;
  }

  .corner-right {
    right: 14px;
    transform-origin: top center;
    animation: swingTendrilRight 3.9s ease-in-out infinite alternate;
  }

  .tendril-stem {
    width: 2.5px;
    height: 48px;
    background: linear-gradient(to bottom, #2e7d32, #43a047);
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  .corner-flora {
    margin-top: -8px;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
  }

  .corner-flora-1 {
    transform: rotate(-15deg);
  }

  .corner-flora-2 {
    transform: rotate(10deg);
  }

  .corner-flora-3 {
    transform: rotate(0deg);
  }

  /* 1. Overall Canopy Wind Sway */
  @keyframes dynamicCanopySway {
    0% {
      transform: translate3d(-4px, 0px, 0) rotate(-0.6deg);
    }
    50% {
      transform: translate3d(2px, -3px, 0) rotate(0.4deg);
    }
    100% {
      transform: translate3d(5px, 2px, 0) rotate(0.7deg);
    }
  }

  /* 2. Hanging Tendril Swinging Animations */
  @keyframes swingTendrilLeft {
    0% {
      transform: rotate(-10deg) translateX(-2px);
    }
    100% {
      transform: rotate(8deg) translateX(3px);
    }
  }

  @keyframes swingTendrilRight {
    0% {
      transform: rotate(10deg) translateX(3px);
    }
    100% {
      transform: rotate(-8deg) translateX(-2px);
    }
  }

  /* 3. Living Flower Bobbing & Pulsing Animations */
  .bloomBobA {
    animation: bobMotionA 3.8s ease-in-out infinite alternate;
  }

  .bloomBobB {
    animation: bobMotionB 4.2s ease-in-out infinite alternate;
  }

  .bloomCenter {
    animation: bobMotionCenter 4.5s ease-in-out infinite alternate;
  }

  .leafRustleA {
    animation: rustleMotionA 3.4s ease-in-out infinite alternate;
  }

  .leafRustleB {
    animation: rustleMotionB 3.9s ease-in-out infinite alternate;
  }

  .sparkleShimmer {
    animation: shimmerGlow 2.8s ease-in-out infinite alternate;
  }

  @keyframes bobMotionA {
    0% {
      transform: translate(-50%, 0px) rotate(-4deg) scale(0.96);
    }
    50% {
      transform: translate(-50%, -5px) rotate(2deg) scale(1.05);
    }
    100% {
      transform: translate(-50%, 3px) rotate(5deg) scale(0.99);
    }
  }

  @keyframes bobMotionB {
    0% {
      transform: translate(-50%, 2px) rotate(3deg) scale(1.03);
    }
    50% {
      transform: translate(-50%, -4px) rotate(-2deg) scale(0.97);
    }
    100% {
      transform: translate(-50%, -1px) rotate(-4deg) scale(1.04);
    }
  }

  @keyframes bobMotionCenter {
    0% {
      transform: translate(-50%, 2px) scale(0.98) rotate(-1deg);
    }
    50% {
      transform: translate(-50%, -6px) scale(1.08) rotate(1.5deg);
    }
    100% {
      transform: translate(-50%, 1px) scale(1.01) rotate(-0.5deg);
    }
  }

  @keyframes rustleMotionA {
    0% {
      transform: translate(-50%, 0) rotate(-6deg) scale(0.98);
    }
    100% {
      transform: translate(-50%, -3px) rotate(6deg) scale(1.04);
    }
  }

  @keyframes rustleMotionB {
    0% {
      transform: translate(-50%, -2px) rotate(5deg) scale(1.02);
    }
    100% {
      transform: translate(-50%, 2px) rotate(-5deg) scale(0.96);
    }
  }

  @keyframes shimmerGlow {
    0% {
      transform: translate(-50%, 0) scale(0.88);
      opacity: 0.75;
    }
    50% {
      transform: translate(-50%, -4px) scale(1.15) rotate(15deg);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 0) scale(0.92);
      opacity: 0.8;
    }
  }

  /* 4. Falling Petals Shower from Canopy */
  .petal-shower {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 2;
  }

  .falling-item {
    position: absolute;
    top: -25px;
    will-change: transform, opacity;
    animation-name: driftFloraDown;
    animation-timing-function: cubic-bezier(0.35, 0.1, 0.25, 1);
    animation-iteration-count: infinite;
    filter: drop-shadow(0 2px 5px rgba(225, 29, 72, 0.3));
  }

  @keyframes driftFloraDown {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.8);
      opacity: 0;
    }
    12% {
      opacity: 0.95;
    }
    50% {
      transform: translate3d(var(--sway-x, 25px), 48vh, 0) rotate(calc(var(--rot-end, 360deg) * 0.5)) scale(1.1);
      opacity: 0.85;
    }
    85% {
      opacity: 0.8;
    }
    100% {
      transform: translate3d(calc(var(--sway-x, 25px) * -0.5), 104vh, 0) rotate(var(--rot-end, 360deg)) scale(0.85);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .garland-sway-bar,
    .corner-left,
    .corner-right,
    .canopy-flower-node,
    .falling-item {
      animation: none !important;
      transform: none !important;
    }
    .petal-shower {
      display: none;
    }
  }
</style>
