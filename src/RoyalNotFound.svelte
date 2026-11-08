<script>
  let { invalidSlug = '404', onContinueAsGuest } = $props();

  function handleGoHome() {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
</script>

<div class="royal-404-overlay" role="region" aria-label="Royal 404 Not Found">
  <!-- Soft fairy dust sparkles -->
  <div class="sparkles-layer" aria-hidden="true">
    {#each Array(10) as _, i}
      <div 
        class="fairy-star"
        style="
          top: {10 + i * 8}%;
          left: {8 + (i * 9) % 84}%;
          animation-delay: {i * 0.35}s;
        "
      >✦</div>
    {/each}
  </div>

  <div class="content-stack">
    <!-- Top Royal Badge -->
    <div class="royal-badge">
      <span class="crown-icon">👑</span>
      <span class="badge-text">Royal Decree • 404</span>
    </div>

    <!-- The Grand Duke (No border, no box) -->
    <div class="duke-stage">
      <img 
        src="/images/grand-duke.png" 
        alt="The Grand Duke" 
        class="duke-img"
        draggable="false"
      />
    </div>

    <!-- Disney Header -->
    <h1 class="disney-heading">Lost In The Kingdom</h1>

    <!-- Playfair Subtitle -->
    <p class="royal-subtitle">
      “This Royal Invitation Scroll could not be found.”
    </p>

    <!-- Message -->
    <p class="royal-description">
      The Grand Duke searched the royal registry from top to bottom, but no invitation was found under 
      <span class="highlight-slug">/{invalidSlug}</span>.
      <br><br>
      Fret not, noble guest! You are still most warmly welcome to celebrate little Princess Elizabeth's royal day.
    </p>

    <!-- Action Buttons (No border/box, soft glowing gradient pills) -->
    <div class="actions-group">
      <button 
        type="button" 
        class="btn-enter"
        onclick={() => onContinueAsGuest?.()}
      >
        <span class="btn-sparkle">✨</span>
        <span>Enter Celebration as Guest</span>
      </button>

      <button 
        type="button" 
        class="btn-home"
        onclick={handleGoHome}
      >
        <span>Return to Palace Gate</span>
      </button>
    </div>
  </div>
</div>

<style>
  .royal-404-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 38%, #fff5f8 0%, #fde2e8 42%, #fbb6ce 82%, #f687b3 100%);
    overflow-y: auto;
    overflow-x: hidden;
    padding: env(safe-area-inset-top, 24px) 20px env(safe-area-inset-bottom, 24px) 20px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .sparkles-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .fairy-star {
    position: absolute;
    color: #ffd700;
    font-size: 14px;
    opacity: 0.65;
    animation: twinkle 2.2s infinite ease-in-out alternate;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
  }

  @keyframes twinkle {
    0% { transform: scale(0.6) rotate(0deg); opacity: 0.3; }
    100% { transform: scale(1.3) rotate(45deg); opacity: 1; }
  }

  .content-stack {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 360px;
    width: 100%;
    margin: auto 0;
  }

  .royal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #9d174d;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .crown-icon {
    font-size: 1rem;
    filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6));
  }

  /* Free-standing Grand Duke (strictly no border, no box) */
  .duke-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }

  .duke-img {
    width: 165px;
    max-width: 46vw;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 14px 28px rgba(225, 29, 72, 0.24));
    animation: gentleBob 3.4s ease-in-out infinite alternate;
  }

  @keyframes gentleBob {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-7px) rotate(1.5deg); }
  }

  /* Disney Font Header */
  .disney-heading {
    font-family: 'Waltograph', 'Cinzel Decorative', cursive, sans-serif;
    font-size: clamp(2rem, 7vw, 2.5rem);
    color: #831843;
    line-height: 1.1;
    margin: 4px 0;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9), 0 3px 12px rgba(225, 29, 72, 0.18);
  }

  /* Subtitle in elegant Playfair Display */
  .royal-subtitle {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1rem, 3.8vw, 1.18rem);
    font-weight: 600;
    color: #9f1239;
    line-height: 1.35;
    margin-bottom: 8px;
  }

  /* Description message */
  .royal-description {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.86rem;
    line-height: 1.55;
    color: #4a2831;
    margin-bottom: 20px;
    max-width: 320px;
  }

  .highlight-slug {
    display: inline-block;
    color: #be123c;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.6);
    padding: 2px 8px;
    border-radius: 6px;
  }

  /* Actions */
  .actions-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 290px;
  }

  .btn-enter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px 20px;
    background: linear-gradient(135deg, #e11d48 0%, #ff2d55 50%, #f43f5e 100%);
    color: #ffffff;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    border: none;
    border-radius: 9999px;
    box-shadow: 0 8px 24px rgba(225, 29, 72, 0.38);
    cursor: pointer;
    touch-action: manipulation;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  }

  .btn-enter:active {
    transform: scale(0.96);
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);
  }

  .btn-sparkle {
    font-size: 1rem;
  }

  .btn-home {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 11px 20px;
    background: transparent;
    color: #831843;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.86rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
    opacity: 0.85;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .btn-home:active {
    opacity: 1;
    transform: scale(0.97);
  }
</style>
