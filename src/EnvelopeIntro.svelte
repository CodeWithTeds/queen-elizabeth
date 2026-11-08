<script>
  import { onMount } from 'svelte';
  import confetti from 'canvas-confetti';

  let { onOpen } = $props();

  let isClosing = $state(false);
  let envelopeEl = $state();

  function triggerOpen(event) {
    if (isClosing) return;
    isClosing = true;

    // Get click/tap coordinates for centered burst
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (event && event.clientX) {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;

    // Multi-stage magical princess confetti explosion
    try {
      confetti({
        particleCount: 75,
        spread: 95,
        origin: { x, y },
        colors: ['#ffd700', '#ff2d55', '#ff69b4', '#ffffff', '#ffe082', '#f48fb1'],
        ticks: 240,
        gravity: 0.75,
        drift: 0.05
      });

      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#ffd700', '#ff6b8b', '#ff4081', '#ffffff']
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#ffd700', '#ff6b8b', '#ff4081', '#ffffff']
        });
      }, 140);
    } catch (_) {}

    // Fairytale opening animation duration
    setTimeout(() => {
      onOpen?.();
    }, 650);
  }

  // Pre-generate golden sparkle stars
  const sparkles = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    top: 8 + (i * 6.5) + (Math.random() * 4 - 2),
    left: 6 + (i * 6.8) + (Math.random() * 5 - 2.5),
    size: 10 + (i % 4) * 6,
    delay: (i * 0.35) % 2.5,
    duration: 2 + (i % 3) * 0.8
  }));
</script>

<div 
  class="envelope-overlay"
  class:closing={isClosing}
  onclick={triggerOpen}
  role="button"
  tabindex="0"
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerOpen(e)}
  aria-label="Open Elizabeth's Birthday Invitation"
>
  <!-- Ambient Fairytale Sparkles -->
  <div class="sparkles-container" aria-hidden="true">
    {#each sparkles as s (s.id)}
      <div 
        class="sparkle-star"
        style="
          top: {s.top}%; 
          left: {s.left}%; 
          width: {s.size}px; 
          height: {s.size}px; 
          animation-delay: {s.delay}s; 
          animation-duration: {s.duration}s;
        "
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    {/each}
  </div>

  <!-- Central Invitation Card -->
  <div class="envelope-card" bind:this={envelopeEl}>
    <!-- Disney Font "You're Invited" Header -->
    <header class="invite-header">
      <h1 class="disney-title">You're Invited</h1>
      <p class="subtitle">Princess Elizabeth's 1st Birthday</p>
    </header>

    <!-- Envelope graphic -->
    <div class="envelope-wrapper">
      <div class="glow-backdrop" aria-hidden="true"></div>
      <img 
        src="/images/envelope.png" 
        alt="Princess Elizabeth's Invitation Envelope" 
        class="envelope-image"
        draggable="false"
      />
    </div>

    <!-- Interactive Tap / Click prompt -->
    <div class="cta-pill">
      <span class="cta-text">Tap to Open</span>
    </div>
  </div>
</div>

<style>
  .envelope-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 45%, #fff5f8 0%, #fed7e2 45%, #fbb6ce 85%, #f687b3 100%);
    cursor: pointer;
    overflow: hidden;
    padding: env(safe-area-inset-top, 20px) 20px env(safe-area-inset-bottom, 24px) 20px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Fairytale exit bloom when envelope opened */
  .envelope-overlay.closing {
    opacity: 0;
    pointer-events: none;
    transform: scale(1.12) translateY(-18px);
    filter: blur(8px) brightness(1.18);
  }

  /* Sparkles background layer */
  .sparkles-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  }

  .sparkle-star {
    position: absolute;
    color: #ffd700;
    opacity: 0.6;
    animation: twinkle ease-in-out infinite alternate;
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
  }

  @keyframes twinkle {
    0% {
      transform: scale(0.6) rotate(0deg);
      opacity: 0.25;
    }
    50% {
      opacity: 0.95;
    }
    100% {
      transform: scale(1.25) rotate(45deg);
      opacity: 0.35;
    }
  }

  /* Main Centered Content Card */
  .envelope-card {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: min(92vw, 480px);
    width: 100%;
    text-align: center;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .envelope-overlay:active .envelope-card {
    transform: scale(0.98);
  }

  /* Header Section with Disney Font */
  .invite-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
  }

  /* Disney Font Title */
  .disney-title {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(2.4rem, 9.5vw, 4.2rem);
    font-weight: 400;
    letter-spacing: 1px;
    color: #e11d48;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 40%, #ff2d55 70%, #f43f5e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 3px 6px rgba(190, 18, 60, 0.28)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.35));
    margin: 0;
    line-height: 1.15;
    white-space: nowrap;
    text-shadow: none;
  }

  .subtitle {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: clamp(0.82rem, 3vw, 1.02rem);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9f1239;
    margin-top: 5px;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
  }

  /* Envelope Graphics Stage */
  .envelope-wrapper {
    position: relative;
    width: 100%;
    max-width: min(82vw, 340px);
    max-height: 38dvh;
    aspect-ratio: 707 / 603;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px 0 14px 0;
    animation: floatEnvelope 4.5s ease-in-out infinite alternate;
  }

  .glow-backdrop {
    position: absolute;
    width: 85%;
    height: 85%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, rgba(254, 205, 211, 0.4) 50%, transparent 75%);
    filter: blur(20px);
    pointer-events: none;
    z-index: 1;
    animation: pulseGlow 3s ease-in-out infinite alternate;
  }

  .envelope-image {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 18px 30px rgba(190, 18, 60, 0.22)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
    transform: translateZ(0);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
  }

  .envelope-wrapper:hover .envelope-image {
    transform: scale(1.03) translateY(-4px);
    filter: drop-shadow(0 22px 35px rgba(190, 18, 60, 0.32)) drop-shadow(0 0 18px rgba(255, 215, 0, 0.4));
  }

  /* Call-to-action button */
  .cta-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 28px;
    background: linear-gradient(135deg, #e11d48 0%, #ff2d55 100%);
    color: #ffffff;
    border-radius: 9999px;
    box-shadow: 
      0 8px 20px -3px rgba(225, 29, 72, 0.45),
      0 0 0 2px rgba(255, 255, 255, 0.8),
      0 0 16px rgba(255, 215, 0, 0.5);
    animation: pulseCta 2.2s ease-in-out infinite;
    transform: translateZ(0);
  }

  .cta-text {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.4rem, 5.2vw, 1.9rem);
    font-weight: 400;
    letter-spacing: 1.2px;
    line-height: 1.1;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  /* Animations */
  @keyframes floatEnvelope {
    0% {
      transform: translateY(0px) rotate(-0.5deg);
    }
    50% {
      transform: translateY(-8px) rotate(0.8deg);
    }
    100% {
      transform: translateY(3px) rotate(-0.4deg);
    }
  }

  @keyframes pulseGlow {
    0% {
      transform: scale(0.9);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.15);
      opacity: 0.95;
    }
  }

  @keyframes pulseCta {
    0%, 100% {
      transform: scale(1);
      box-shadow: 
        0 8px 20px -3px rgba(225, 29, 72, 0.45),
        0 0 0 2px rgba(255, 255, 255, 0.8),
        0 0 16px rgba(255, 215, 0, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 
        0 12px 28px -3px rgba(225, 29, 72, 0.6),
        0 0 0 3px #ffd700,
        0 0 24px rgba(255, 215, 0, 0.7);
    }
  }
</style>
