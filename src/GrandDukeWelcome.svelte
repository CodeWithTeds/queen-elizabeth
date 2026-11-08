<script>
  import { onMount } from 'svelte';
  import confetti from 'canvas-confetti';
  import { resolveGuestFromUrl } from './guestRegistry.js';

  let { onEnter } = $props();

  let guestInfo = $state({
    title: '',
    firstName: 'Special Guest',
    displayName: 'Special Guest',
    isGodparent: false,
    role: 'Guest'
  });
  let isClosing = $state(false);

  onMount(() => {
    try {
      guestInfo = resolveGuestFromUrl();
    } catch (_) {}
  });

  function handleProceed(event) {
    if (isClosing) return;
    isClosing = true;

    // Centered royal celebratory confetti explosion
    try {
      let clientX = window.innerWidth / 2;
      let clientY = window.innerHeight / 2;
      if (event && event.clientX) {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      // Magical fairytale princess sparkle burst
      confetti({
        particleCount: 65,
        spread: 95,
        origin: { x, y },
        colors: ['#ffd700', '#ff2d55', '#ff69b4', '#ffffff', '#ffd54f', '#f48fb1'],
        ticks: 240,
        gravity: 0.75,
        drift: 0.05
      });
    } catch (_) {}

    setTimeout(() => {
      onEnter?.();
    }, 620);
  }

  // Pre-generate golden sparkles
  const sparkles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    top: 6 + (i * 7.5) + (Math.random() * 4 - 2),
    left: 5 + (i * 8) + (Math.random() * 5 - 2.5),
    size: 10 + (i % 3) * 6,
    delay: (i * 0.4) % 2.5,
    duration: 2.2 + (i % 3) * 0.7
  }));
</script>

<div 
  class="duke-welcome-overlay"
  class:closing={isClosing}
  onclick={handleProceed}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleProceed(e)}
  role="button"
  tabindex="0"
  aria-label="Welcome by The Grand Duke. Tap to enter the celebration."
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

  <!-- Title on Top -->
  <header class="top-header">
    <h1 class="disney-title-top">The Grand Duke</h1>
  </header>

  <!-- Content: Message on LEFT, Grand Duke on RIGHT, No Border -->
  <div class="duke-layout">
    <!-- LEFT: Message (No Border, Just Display Text) -->
    <div class="message-col">
      {#if guestInfo.isGodparent}
        <div class="godparent-crown-tag">
          <span class="crown-sparkle">👑</span>
          <span class="tag-label">Royal {guestInfo.title}</span>
        </div>
      {/if}

      <h2 class="duke-greeting">
        Oh! You’re here now, <span class="guest-name">{guestInfo.title ? guestInfo.title + ' ' : ''}{guestInfo.firstName}</span>!
      </h2>

      <p class="joke-text">
        Her Majesty, Queen Elizabeth, is delighted by your arrival. Do come in, before the cake disappears!!!
      </p>

      <!-- Action Button in Disney Font -->
      <div class="cta-row">
        <div class="enter-btn-pill">
          <span class="enter-text">Do Come In</span>
        </div>
      </div>
    </div>

    <!-- RIGHT: Grand Duke Image -->
    <div class="duke-stage">
      <img 
        src="/images/grand-duke.png" 
        alt="The Grand Duke" 
        class="duke-full-img"
        draggable="false"
      />
    </div>
  </div>
</div>

<style>
  .duke-welcome-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 60% 40%, #fff7f9 0%, #fde2e8 45%, #fbb6ce 85%, #f687b3 100%);
    cursor: pointer;
    overflow-y: auto;
    overflow-x: hidden;
    padding: env(safe-area-inset-top, 20px) 16px env(safe-area-inset-bottom, 20px) 16px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    transition: 
      opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), 
      transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), 
      filter 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Fairytale exit bloom when entering home page */
  .duke-welcome-overlay.closing {
    opacity: 0;
    pointer-events: none;
    transform: scale(1.1) translateY(-16px);
    filter: blur(8px) brightness(1.18);
  }

  /* Sparkles layer */
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
    animation: twinkleStar ease-in-out infinite alternate;
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
  }

  @keyframes twinkleStar {
    0% {
      transform: scale(0.6) rotate(0deg);
      opacity: 0.25;
    }
    100% {
      transform: scale(1.25) rotate(45deg);
      opacity: 0.95;
    }
  }

  /* Title on Top */
  .top-header {
    width: 100%;
    max-width: min(94vw, 560px);
    text-align: center;
    margin-bottom: clamp(8px, 2.5vh, 18px);
    position: relative;
    z-index: 2;
    animation: fairytaleTitleEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fairytaleTitleEntrance {
    0% {
      opacity: 0;
      transform: translateY(-16px) scale(0.94);
      filter: blur(4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  .disney-title-top {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(2.4rem, 9.2vw, 4.2rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 1px;
    color: #e11d48;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 40%, #ff2d55 70%, #f43f5e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 3px 6px rgba(190, 18, 60, 0.28)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.35));
    margin: 0;
    white-space: nowrap;
  }

  /* Main Split Layout: LEFT (Message) & RIGHT (Grand Duke) */
  .duke-layout {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: clamp(12px, 3.5vw, 28px);
    width: 100%;
    max-width: min(94vw, 560px);
    animation: fairytaleEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fairytaleEntrance {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(12px);
      filter: blur(4px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
      filter: blur(0);
    }
  }

  .duke-welcome-overlay:active .duke-layout {
    transform: scale(0.98);
  }

  /* LEFT: Message Column - Strictly No Border, Clean Text */
  .message-col {
    flex: 1 1 58%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    padding: 0;
  }

  .godparent-crown-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: clamp(0.68rem, 2.1vw, 0.8rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #be123c;
    background: rgba(255, 255, 255, 0.6);
    padding: 2px 8px;
    border-radius: 9999px;
    border: none;
    box-shadow: none;
    margin-bottom: 4px;
  }

  .crown-sparkle {
    font-size: 0.95em;
  }

  .duke-greeting {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.6rem, 5.8vw, 2.7rem);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: 0.6px;
    color: #be123c;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 45%, #ff2d55 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(190, 18, 60, 0.25));
    margin: 0 0 10px 0;
  }

  .guest-name {
    color: #be123c;
    -webkit-text-fill-color: #be123c;
    text-decoration: underline;
    text-decoration-color: #ffd54f;
    text-decoration-thickness: 3px;
  }

  /* Non-Disney body text strictly in San Francisco */
  .joke-text {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: clamp(0.96rem, 3.5vw, 1.15rem);
    font-weight: 500;
    color: #4a1525;
    line-height: 1.5;
    letter-spacing: -0.01em;
    margin: 0 0 18px 0;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
  }

  .cta-row {
    display: flex;
    align-items: flex-start;
  }

  .enter-btn-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 28px;
    background: linear-gradient(135deg, #e11d48 0%, #ff2d55 100%);
    color: #ffffff;
    border-radius: 9999px;
    box-shadow: 
      0 8px 18px -3px rgba(225, 29, 72, 0.45),
      0 0 0 2px rgba(255, 255, 255, 0.85),
      0 0 14px rgba(255, 215, 0, 0.45);
    animation: pulseCtaBtn 2.2s ease-in-out infinite;
    transform: translateZ(0);
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease;
  }

  .enter-btn-pill:active {
    transform: scale(0.96);
  }

  .enter-text {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.25rem, 4.4vw, 1.7rem);
    font-weight: 400;
    letter-spacing: 1px;
    line-height: 1.1;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  /* RIGHT: Grand Duke Image Column */
  .duke-stage {
    flex: 0 0 42%;
    max-width: min(44vw, 210px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: dukeBreathe 4s ease-in-out infinite alternate;
  }

  .duke-full-img {
    width: 100%;
    max-height: min(50dvh, 380px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 14px 26px rgba(190, 18, 60, 0.25)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12));
    user-select: none;
    -webkit-user-drag: none;
  }

  @keyframes dukeBreathe {
    0% {
      transform: translateY(0px) rotate(-0.5deg);
    }
    50% {
      transform: translateY(-5px) rotate(0.6deg);
    }
    100% {
      transform: translateY(2px) rotate(-0.4deg);
    }
  }

  @keyframes pulseCtaBtn {
    0%, 100% {
      transform: scale(1);
      box-shadow: 
        0 8px 18px -3px rgba(225, 29, 72, 0.45),
        0 0 0 2px rgba(255, 255, 255, 0.85),
        0 0 14px rgba(255, 215, 0, 0.45);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 
        0 12px 24px -3px rgba(225, 29, 72, 0.6),
        0 0 0 3px #ffd700,
        0 0 20px rgba(255, 215, 0, 0.65);
    }
  }
</style>
