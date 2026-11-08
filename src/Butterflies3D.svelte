<script>
  // Pure, hardware-accelerated, lightweight fairytale butterflies (0 Three.js, 0 CPU lag)
  const butterflies = [
    { id: 1, baseColor: '#ff4d6d', spotColor: '#ffd700', size: 30, flightClass: 'flight-path-1', delay: 0 },
    { id: 2, baseColor: '#ff758f', spotColor: '#ffffff', size: 24, flightClass: 'flight-path-2', delay: 2.5 },
    { id: 3, baseColor: '#ffd166', spotColor: '#ff2d55', size: 22, flightClass: 'flight-path-3', delay: 5.2 }
  ];
</script>

<div class="butterflies-container" aria-hidden="true">
  {#each butterflies as b (b.id)}
    <div 
      class="butterfly-rig {b.flightClass}" 
      style="animation-delay: {b.delay}s; width: {b.size}px; height: {b.size}px;"
    >
      <div class="butterfly-body-3d">
        <!-- Left Wing -->
        <svg class="wing wing-left" viewBox="0 0 40 48" fill="none">
          <path 
            d="M38 24C32 10 14 2 2 12C-4 18 2 32 18 36C4 38 2 46 14 48C26 50 34 38 38 24Z" 
            fill="{b.baseColor}" 
            stroke="#ffffff" 
            stroke-width="1.2"
          />
          <circle cx="16" cy="18" r="3" fill="{b.spotColor}" opacity="0.9" />
          <circle cx="22" cy="34" r="2.2" fill="{b.spotColor}" opacity="0.8" />
        </svg>

        <!-- Spine Body -->
        <div class="butterfly-thorax"></div>

        <!-- Right Wing -->
        <svg class="wing wing-right" viewBox="0 0 40 48" fill="none">
          <path 
            d="M2 24C8 10 26 2 38 12C44 18 38 32 22 36C36 38 38 46 26 48C14 50 6 38 2 24Z" 
            fill="{b.baseColor}" 
            stroke="#ffffff" 
            stroke-width="1.2"
          />
          <circle cx="24" cy="18" r="3" fill="{b.spotColor}" opacity="0.9" />
          <circle cx="18" cy="34" r="2.2" fill="{b.spotColor}" opacity="0.8" />
        </svg>
      </div>
    </div>
  {/each}
</div>

<style>
  .butterflies-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 20;
    contain: strict;
  }

  .butterfly-rig {
    position: absolute;
    will-change: transform;
    perspective: 400px;
  }

  .butterfly-body-3d {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
  }

  .butterfly-thorax {
    width: 3px;
    height: 18px;
    background: #3d1a24;
    border-radius: 9999px;
    z-index: 2;
  }

  .wing {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    will-change: transform;
    transform-origin: center right;
  }

  .wing-left {
    right: 50%;
    transform-origin: right center;
    animation: flapLeft 0.28s ease-in-out infinite alternate;
  }

  .wing-right {
    left: 50%;
    transform-origin: left center;
    animation: flapRight 0.28s ease-in-out infinite alternate;
  }

  @keyframes flapLeft {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(68deg); }
  }

  @keyframes flapRight {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(-68deg); }
  }

  /* Smooth GPU-Composited Flight Paths */
  .flight-path-1 {
    animation: flight1 16s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  .flight-path-2 {
    animation: flight2 20s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  .flight-path-3 {
    animation: flight3 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes flight1 {
    0% {
      transform: translate3d(-40px, 320px, 0) scale(0.7) rotate(15deg);
      opacity: 0;
    }
    10% { opacity: 0.95; }
    30% {
      transform: translate3d(80px, 180px, 0) scale(0.85) rotate(35deg);
    }
    55% {
      transform: translate3d(210px, 240px, 0) scale(0.75) rotate(-10deg);
    }
    80% {
      transform: translate3d(320px, 120px, 0) scale(0.9) rotate(20deg);
      opacity: 0.95;
    }
    100% {
      transform: translate3d(430px, 60px, 0) scale(0.7) rotate(10deg);
      opacity: 0;
    }
  }

  @keyframes flight2 {
    0% {
      transform: translate3d(380px, 420px, 0) scale(0.75) rotate(-25deg);
      opacity: 0;
    }
    12% { opacity: 0.9; }
    35% {
      transform: translate3d(220px, 260px, 0) scale(0.8) rotate(-40deg);
    }
    60% {
      transform: translate3d(110px, 170px, 0) scale(0.7) rotate(10deg);
    }
    85% {
      transform: translate3d(-10px, 90px, 0) scale(0.85) rotate(-15deg);
      opacity: 0.9;
    }
    100% {
      transform: translate3d(-60px, 40px, 0) scale(0.7) rotate(-20deg);
      opacity: 0;
    }
  }

  @keyframes flight3 {
    0% {
      transform: translate3d(-30px, 160px, 0) scale(0.65) rotate(30deg);
      opacity: 0;
    }
    15% { opacity: 0.85; }
    45% {
      transform: translate3d(160px, 110px, 0) scale(0.8) rotate(-5deg);
    }
    75% {
      transform: translate3d(260px, 70px, 0) scale(0.75) rotate(25deg);
      opacity: 0.85;
    }
    100% {
      transform: translate3d(380px, 20px, 0) scale(0.65) rotate(15deg);
      opacity: 0;
    }
  }
</style>
