<script>
  import confetti from 'canvas-confetti';

  // Schedule milestones from 10:00 AM to 5:00 PM (Location A to Location B)
  const steps = [
    {
      time: '10:00 AM',
      location: 'Location A: Royal Palace Gates (St. Raphael Church)',
      title: 'Grand Welcome & Royal Arrival',
      realm: 'Princess Courtyard',
      desc: 'Red carpet entry, royal heralds, welcome drinks & baby Elizabeth greeting the guests.',
      icon: '🏰',
      color: '#e11d48'
    },
    {
      time: '11:30 AM',
      location: 'Location B: Enchanted Banquet Hall',
      title: 'Royal Princess Feast',
      realm: 'Beast’s Grand Ballroom',
      desc: 'Delicious gourmet lunch, themed Disney treats, baby-friendly finger food & desserts.',
      icon: '👑',
      color: '#ff2d55'
    },
    {
      time: '1:00 PM',
      location: 'Location C: Wonderland Garden',
      title: 'Baby Playtime & Princess Parade',
      realm: 'Fantasyland Meadow',
      desc: 'Soft baby play area, cheerful Disney sing-alongs, music, bubbles & magical games.',
      icon: '🌸',
      color: '#ba68c8'
    },
    {
      time: '2:30 PM',
      location: 'Location D: Cinderella’s Ballroom',
      title: 'Royal Birthday Cake Cutting',
      realm: 'Magic Candle Castle',
      desc: 'Elizabeth’s birthday wish, candle lighting, cake ceremony & grand family toast.',
      icon: '🎂',
      color: '#ffd54f'
    },
    {
      time: '4:00 PM',
      location: 'Location E: Fairy Tale Forest',
      title: 'Princess Photo Booth & Favors',
      realm: 'Enchanted Woodland',
      desc: 'Photo session with Elizabeth & princess backdrops, keepsake gift boxes for guests.',
      icon: '✨',
      color: '#ff6b8b'
    },
    {
      time: '5:00 PM',
      location: 'Location F: Kingdom Plaza',
      title: 'Sparkling Finale & Royal Farewell',
      realm: 'Happily Ever After',
      desc: 'Grand sparkling send-off, heartfelt thanks & farewell hugs from the royal family.',
      icon: '💖',
      color: '#ff4081'
    }
  ];

  let activeStep = $state(0);
  let cardRotations = $state(steps.map(() => ({ x: 0, y: 0 })));

  function selectStep(idx, e) {
    activeStep = idx;

    // Burst sparkles at touch point
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x, y },
        colors: ['#ffd700', '#ff2d55', '#ff80ab', '#ffffff']
      });
    }
  }

  function handleCardMove(idx, e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRotations[idx] = {
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 12
    };
  }

  function handleCardLeave(idx) {
    cardRotations[idx] = { x: 0, y: 0 };
  }
</script>

<div class="schedule-viewport">
  <!-- Disney 3D Header -->
  <header class="schedule-header">
    <div class="header-badge">
      <span class="sparkle-icon">✨</span>
      <span>ROYAL ITINERARY</span>
      <span class="sparkle-icon">✨</span>
    </div>
    <h2 class="schedule-title">Elizabeth’s Magical Day</h2>
    <p class="schedule-subtitle">10:00 AM — 5:00 PM • A Disney Princess Journey</p>
  </header>

  <!-- 3D Journey Steps Scroll Container -->
  <div class="steps-track">
    <!-- Connecting 3D Golden Magic Path -->
    <div class="magic-path-line" aria-hidden="true">
      <div 
        class="magic-path-progress" 
        style="height: {(activeStep / (steps.length - 1)) * 100}%;"
      ></div>
    </div>

    {#each steps as step, i}
      <div 
        class="step-item"
        class:active={activeStep === i}
        style="--step-color: {step.color};"
      >
        <!-- 3D Milestone Node on Path -->
        <div 
          class="step-node"
          onclick={(e) => selectStep(i, e)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && selectStep(i, e)}
          aria-label="{step.time} {step.title}"
        >
          <div class="node-ring"></div>
          <div class="node-icon">{step.icon}</div>
        </div>

        <!-- 3D Perspective Card (Location A to Location B) -->
        <div 
          class="card-3d-wrapper"
          onpointermove={(e) => handleCardMove(i, e)}
          onpointerleave={() => handleCardLeave(i)}
          onclick={(e) => selectStep(i, e)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && selectStep(i, e)}
          style="
            transform: perspective(800px) rotateX({cardRotations[i].x}deg) rotateY({cardRotations[i].y}deg);
          "
        >
          <div class="disney-card" class:card-active={activeStep === i}>
            <!-- Top Card Header: 3D Time Tag & Location -->
            <div class="card-meta">
              <span class="time-badge">{step.time}</span>
              <span class="realm-badge">{step.realm}</span>
            </div>

            <div class="location-banner">
              <span class="loc-pin">📍</span>
              <span class="loc-text">{step.location}</span>
            </div>

            <h3 class="step-title">{step.title}</h3>
            <p class="step-desc">{step.desc}</p>

            <div class="card-glow" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .schedule-viewport {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: y proximity;
    -webkit-overflow-scrolling: touch;
    padding: calc(75px + env(safe-area-inset-top, 0px)) 18px calc(80px + env(safe-area-inset-bottom, 0px)) 18px;
    box-sizing: border-box;
    position: relative;
    z-index: 10;
  }

  /* Header */
  .schedule-header {
    text-align: center;
    margin-bottom: 24px;
    position: relative;
    z-index: 5;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    background: rgba(255, 255, 255, 0.85);
    border: 1.5px solid #ffd54f;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #e11d48;
    letter-spacing: 0.08em;
    box-shadow: 0 4px 14px rgba(255, 213, 79, 0.35);
  }

  .sparkle-icon {
    font-size: 0.85rem;
  }

  .schedule-title {
    font-size: 1.65rem;
    font-weight: 800;
    color: #880e4f;
    margin-top: 8px;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.9);
  }

  .schedule-subtitle {
    font-size: 0.88rem;
    font-weight: 600;
    color: #ad1457;
    margin-top: 4px;
  }

  /* 3D Path Track */
  .steps-track {
    position: relative;
    max-width: 520px;
    margin: 0 auto;
    padding-left: 48px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* Connecting 3D Golden Magic Path */
  .magic-path-line {
    position: absolute;
    top: 24px;
    bottom: 30px;
    left: 20px;
    width: 4px;
    background: rgba(255, 213, 79, 0.35);
    border-radius: 4px;
    overflow: hidden;
  }

  .magic-path-progress {
    width: 100%;
    background: linear-gradient(to bottom, #ff2d55, #ffd54f);
    box-shadow: 0 0 10px #ffd54f;
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Step Item */
  .step-item {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  /* Milestone 3D Node */
  .step-node {
    position: absolute;
    left: -48px;
    top: 14px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
    -webkit-tap-highlight-color: transparent;
  }

  .node-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid #ffd54f;
    box-shadow: 0 4px 14px rgba(233, 30, 99, 0.25);
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  .step-item.active .node-ring {
    border-color: #ff2d55;
    transform: scale(1.15);
    box-shadow: 0 0 18px rgba(255, 45, 85, 0.55);
  }

  .node-icon {
    position: relative;
    z-index: 2;
    font-size: 1.15rem;
    transition: transform 0.3s ease;
  }

  .step-item.active .node-icon {
    transform: scale(1.1);
  }

  /* 3D Perspective Card Wrapper */
  .card-3d-wrapper {
    width: 100%;
    perspective: 800px;
    transform-style: preserve-3d;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .disney-card {
    position: relative;
    padding: 16px 18px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 2px solid rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 
      0 10px 24px rgba(136, 14, 79, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .disney-card.card-active {
    background: rgba(255, 255, 255, 0.96);
    border-color: #ffd54f;
    box-shadow: 
      0 14px 34px rgba(233, 30, 99, 0.24),
      0 0 0 3px rgba(255, 213, 79, 0.4);
    transform: translateZ(12px);
  }

  /* Meta header in card */
  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .time-badge {
    font-size: 0.82rem;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, #e11d48, #ff4081);
    padding: 4px 10px;
    border-radius: 999px;
    box-shadow: 0 3px 8px rgba(225, 29, 72, 0.35);
    letter-spacing: 0.02em;
  }

  .realm-badge {
    font-size: 0.76rem;
    font-weight: 700;
    color: #ad1457;
    background: rgba(255, 224, 230, 0.65);
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 128, 171, 0.3);
  }

  /* Location A to B */
  .location-banner {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.84rem;
    font-weight: 700;
    color: #4a148c;
    margin-bottom: 6px;
  }

  .loc-pin {
    font-size: 0.9rem;
  }

  .step-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #880e4f;
    line-height: 1.25;
    margin-bottom: 6px;
  }

  .step-desc {
    font-size: 0.82rem;
    color: #4a5568;
    line-height: 1.45;
    margin: 0;
  }

  .card-glow {
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 213, 79, 0.22), transparent 70%);
    pointer-events: none;
  }
</style>
