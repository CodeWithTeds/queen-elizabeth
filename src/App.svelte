<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import CLOUDS from 'vanta/dist/vanta.clouds.min.js';
  import confetti from 'canvas-confetti';
  import GrassCanvas from './GrassCanvas.svelte';
  import Butterflies3D from './Butterflies3D.svelte';
  import TopFlowerGarland from './TopFlowerGarland.svelte';
  import EnvelopeIntro from './EnvelopeIntro.svelte';
  import GrandDukeWelcome from './GrandDukeWelcome.svelte';
  import RoyalNotFound from './RoyalNotFound.svelte';
  import { preloadHeroSingleFlight } from './singleFlight.js';
  import { resolveGuestFromUrl } from './guestRegistry.js';

  let vantaElement;
  let vantaEffect;
  let videoEl = $state();
  let activeChurchPanel = $state(-1);
  let guestInfo = $state(resolveGuestFromUrl());

  onMount(() => {
    try {
      guestInfo = resolveGuestFromUrl();
    } catch (_) {}
  });

  const churchPanels = [
    {
      id: 'p1',
      title: 'Parish',
      type: 'image',
      src: '/images/church.png'
    },
    {
      id: 'p2',
      title: 'Interior',
      type: 'image',
      src: '/images/insideofchurch.png'
    },
    {
      id: 'p3',
      title: 'Ceremony',
      type: 'video',
      src: '/images/church-video-loop.mp4'
    },
    {
      id: 'p4',
      title: 'Façade',
      type: 'image',
      src: '/images/simbahan.png'
    }
  ];

  /* 4th Page: Elizabeth 1-10 Months Asymmetric 6-Box Collage (Reference: uploaded mockup) */
  const elizabethMilestones = [
    { month: 1, label: '1st Month', title: '1 Month Old', src: '/images/1-10/1st.jpeg' },
    { month: 2, label: '2nd Month', title: '2 Months Old', src: '/images/1-10/2.jpg' },
    { month: 3, label: '3rd Month', title: '3 Months Old', src: '/images/1-10/3rd.jpg' },
    { month: 4, label: '4th Month', title: '4 Months Old', src: '/images/1-10/4.jpg' },
    { month: 5, label: '5th Month', title: '5 Months Old', src: '/images/1-10/5th.jpg' },
    { month: 6, label: '6th Month', title: '6 Months Old', src: '/images/1-10/6.jpg' },
    { month: 7, label: '7th Month', title: '7 Months Old', src: '/images/1-10/7.jpg' },
    { month: 8, label: '8th Month', title: '8 Months Old', src: '/images/1-10/8.jpg' },
    { month: 9, label: '9th Month', title: '9 Months Old', src: '/images/1-10/9.jpg' },
    { month: 10, label: '10th Month', title: '10 Months Old', src: '/images/1-10/10.png' }
  ];

  let memoriesActiveSet = $state(0); // 0 = Months 1-5, 1 = Months 6-10
  let selectedLightboxIndex = $state(-1); // -1 = closed, 0..9 = open
  let touchStartX = 0;
  let touchStartY = 0;

  function handleCollageTouchStart(e) {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleCollageTouchEnd(e) {
    if (e.changedTouches && e.changedTouches[0]) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          memoriesActiveSet = 1;
        } else {
          memoriesActiveSet = 0;
        }
      }
    }
  }

  function openLightbox(index) {
    selectedLightboxIndex = index;
  }

  function closeLightbox() {
    selectedLightboxIndex = -1;
  }

  function nextLightbox() {
    if (selectedLightboxIndex >= 0) {
      selectedLightboxIndex = (selectedLightboxIndex + 1) % elizabethMilestones.length;
    }
  }

  function prevLightbox() {
    if (selectedLightboxIndex >= 0) {
      selectedLightboxIndex = (selectedLightboxIndex - 1 + elizabethMilestones.length) % elizabethMilestones.length;
    }
  }

  let introStep = $state('envelope'); // 'envelope' | 'grand-duke' | 'home'
  let isHomeReady = $state(false);

  function handleOpenEnvelope() {
    introStep = 'grand-duke';
  }

  async function handleEnterHome() {
    // Single-flight gate: ensure hero image and assets are 100% ready before unveiling home
    await preloadHeroSingleFlight();
    isHomeReady = true;
    introStep = 'home';
    setTimeout(() => {
      if (videoEl) {
        videoEl.play().catch(() => {});
      }
      if (vantaElement && !vantaEffect) {
        try {
          vantaEffect = CLOUDS({
            el: vantaElement,
            THREE: THREE,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 130.0,
            minWidth: 200.0,
            skyColor: 0xfce4ec,
            cloudColor: 0xffffff,
            cloudShadowColor: 0xf48fb1,
            sunColor: 0xffd54f,
            sunGlareColor: 0xff80ab,
            sunlightColor: 0xfff9c4,
            speed: 1.0
          });
        } catch (_) {}
      }
    }, 60);
  }

  // Balloon colors matching her red princess dress and pink theme
  const balloonColors = [
    '#e11d48', // Ruby red
    '#ff2d55', // Bright pink
    '#ff6b8b', // Soft rose
    '#ffd166', // Golden yellow
    '#ba68c8', // Soft purple
    '#ff4081'  // Hot pink
  ];

  // Pre-generate balloons for continuous gentle floating
  const balloons = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: 4 + (i * 8) + (Math.random() * 4 - 2),
    duration: 9 + (i % 5) * 2 + Math.random() * 2,
    delay: (i * 0.9) % 7,
    scale: 0.75 + (i % 4) * 0.12,
    color: balloonColors[i % balloonColors.length]
  }));

  // Pre-generate gentle floating hearts
  const heartColors = ['#ff2d55', '#ff4d6d', '#ff758f', '#ffb3c1'];
  const hearts = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: 8 + (i * 11) + (Math.random() * 5),
    duration: 11 + (i % 4) * 2.5,
    delay: (i * 1.3) % 9,
    scale: 0.65 + (i % 3) * 0.25,
    color: heartColors[i % heartColors.length]
  }));

  function handleScreenTap(e) {
    if (introStep !== 'home') return;
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: ['#ff2d55', '#ffd700', '#ff6b8b', '#ff4081', '#ffffff']
    });
  }

  onMount(() => {
    // Initialize 3D Cloud strictly on top
    if (vantaElement) {
      vantaEffect = CLOUDS({
        el: vantaElement,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 130.0,
        minWidth: 200.0,
        skyColor: 0xfce4ec,        // Dreamy pastel pink sky
        cloudColor: 0xffffff,      // Soft white fluffy clouds
        cloudShadowColor: 0xf48fb1, // Soft rosy cloud shadow
        sunColor: 0xffd54f,        // Warm golden sunlight
        sunGlareColor: 0xff80ab,   // Gentle pink glare
        sunlightColor: 0xfff9c4,   // Warm ambient sunlight
        speed: 1.0
      });
    }

    if (videoEl) {
      videoEl.play().catch(() => {});
    }
  });

  onDestroy(() => {
    if (vantaEffect) {
      vantaEffect.destroy();
    }
  });
</script>

<main class="app-container" class:intro-active={introStep !== 'home'} class:home-ready={introStep === 'home' && isHomeReady} onpointerdown={handleScreenTap} role="region" aria-label="Elizabeth Birthday App">
  <!-- Royal 404 Screen for unrecognized route / invitation scrolls -->
  {#if guestInfo.isNotFound}
    <RoyalNotFound 
      invalidSlug={guestInfo.invalidSlug}
      onContinueAsGuest={() => {
        guestInfo.isNotFound = false;
      }}
    />
  {/if}

  <!-- Intro Sequence (Steps 1 & 2 before Home Screen) -->
  {#if introStep !== 'home'}
    <!-- Step 2: The Grand Duke Welcomes Guests (Directly underneath the envelope) -->
    <GrandDukeWelcome onEnter={handleEnterHome} />

    <!-- Step 1: Interactive Envelope First Screen (Sits directly on top at z-index: 9999) -->
    {#if introStep === 'envelope'}
      <EnvelopeIntro onOpen={handleOpenEnvelope} />
    {/if}
  {/if}

  <!-- Home Screen Content (Hidden while on intro screens) -->
  <div class="home-screen-content" class:home-hidden={introStep !== 'home'}>
    <!-- 2D Flowers Garland on top (fixed frame) -->
    <TopFlowerGarland />

    <!-- Interactive Blooming Flower Garden at the bottom (fixed frame across all pages) -->
    <GrassCanvas />

  <!-- Cloud on top (fixed frame) -->
  <div bind:this={vantaElement} class="cloud-top" aria-hidden="true"></div>

  <!-- Ambient Floating Balloons and Hearts (fixed across all pages) -->
  <div class="floating-elements" aria-hidden="true">
    {#each balloons as b (b.id)}
      <div 
        class="balloon" 
        style="
          left: {b.left}%; 
          animation-duration: {b.duration}s; 
          animation-delay: -{b.delay}s;
          --balloon-color: {b.color};
          --scale: {b.scale};
        "
      >
        <div class="balloon-body"></div>
        <div class="balloon-knot"></div>
        <div class="balloon-string"></div>
      </div>
    {/each}

    {#each hearts as h (h.id)}
      <div 
        class="floating-heart"
        style="
          left: {h.left}%;
          animation-duration: {h.duration}s;
          animation-delay: -{h.delay}s;
          --scale: {h.scale};
          --heart-color: {h.color};
        "
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    {/each}
  </div>

  <!-- PAGE 1: Main Screen with Elizabeth, 3D WebGL Butterflies, and Blooming Garden -->
  <section class="page-snap-screen page-1">
    <div class="stage">
      <img 
        src="/images/main-page.avif" 
        alt="Elizabeth" 
        class="center-image" 
        draggable="false"
        width="1858"
        height="2844"
        loading="eager"
        fetchpriority="high"
        decoding="sync"
      />
    </div>

    <!-- 3D WebGL Butterflies Fluttering Around Flowers & Elizabeth -->
    <Butterflies3D />
  </section>

  <!-- PAGE 2: Modern Church Showcase -->
  <section class="page-snap-screen page-church">
    <div class="church-mobile-layout">
      <!-- Church Title & Historical Heritage Text -->
      <header class="church-header-info">
        <h3 class="church-time-title">10:00 AM to 11:00 AM</h3>
        <h2 class="church-title">St. Raphael the Archangel Parish - Montalban</h2>
        <p class="church-desc">
          The seed of St. Raphael the Archangel Parish was a chapel built in Brgy. San Rafael, Rodriguez, Rizal, which was then part of the parish of Our Lady of the Most Holy Rosary.
        </p>
      </header>

      <!-- Dynamic 3D Perspective Collage Stage (Referenced from uploaded mockup) -->
      <div class="church-triptych-stage">
        {#each churchPanels as panel, idx (panel.id)}
          <div 
            class="triptych-card triptych-card-{idx + 1}"
            class:triptych-card-active={activeChurchPanel === idx}
            onclick={() => activeChurchPanel = activeChurchPanel === idx ? -1 : idx}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && (activeChurchPanel = activeChurchPanel === idx ? -1 : idx)}
          >
            {#if panel.type === 'video'}
              <video
                bind:this={videoEl}
                src={panel.src}
                autoplay
                loop
                muted
                playsinline
                webkit-playsinline
                preload="auto"
                class="triptych-media"
              ></video>
            {:else}
              <img
                src={panel.src}
                alt={panel.title}
                class="triptych-media"
                draggable="false"
              />
            {/if}
            <div class="triptych-label">
              <span>{panel.title}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- PAGE 3: The Venue Videos (All displayed directly with infinite loop) -->
  <section class="page-snap-screen page-venue">
    <div class="venue-mobile-layout">
      <!-- Venue Header Title & Location Info -->
      <header class="venue-header-info">
        <h2 class="venue-title">Venue</h2>
        <p class="venue-location">Greenbreeze Phase 2 Montalban Rizal Swimming Pool</p>
      </header>

      <!-- All Venue Videos Displayed Directly -->
      <div class="venue-videos-grid">
        <div class="venue-video-card">
          <video
            src="/images/pool.mp4"
            poster="/images/pool-thumb.jpg"
            autoplay
            loop
            muted
            playsinline
            webkit-playsinline
            preload="auto"
            onloadedmetadata={(e) => e.currentTarget.play().catch(() => {})}
            onended={(e) => { e.currentTarget.currentTime = 0; e.currentTarget.play().catch(() => {}); }}
            class="venue-video-media"
          ></video>
        </div>

        <div class="venue-video-card">
          <video
            src="/images/swimming.mp4"
            poster="/images/swimming-thumb.jpg"
            autoplay
            loop
            muted
            playsinline
            webkit-playsinline
            preload="auto"
            onloadedmetadata={(e) => e.currentTarget.play().catch(() => {})}
            onended={(e) => { e.currentTarget.currentTime = 0; e.currentTarget.play().catch(() => {}); }}
            class="venue-video-media"
          ></video>
        </div>
      </div>
    </div>
  </section>

  <!-- PAGE 4: Elizabeth 1-10 Months Collage (Exact reference: uploaded 6-box collage) -->
  <!-- PAGE 4: Elizabeth 1-10 Months (All 10 Photos at Once - Borderless & Boxless) -->
  <section class="page-snap-screen page-memories">
    <div class="memories-mobile-layout">
      <!-- Editorial Header -->
      <header class="memories-header-info">
        <span class="memories-script-title">The sweet</span>
        <h2 class="memories-main-title">MEMORIES</h2>
      </header>

      <!-- All 10 Photos Displayed at Once: Pure Borderless & Boxless Mosaic -->
      <div 
        class="memories-mosaic-stage"
        role="region"
        aria-label="Elizabeth 1-10 Months Photo Showcase"
      >
        {#each elizabethMilestones as item, idx}
          <button
            type="button"
            class="mosaic-item mosaic-item-{idx + 1}"
            onclick={() => openLightbox(idx)}
            aria-label="{item.label}"
          >
            <img
              src={item.src}
              alt={item.title}
              class="mosaic-img"
              loading="eager"
            />
            <span class="mosaic-badge">{item.month}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Fullscreen Interactive Lightbox Modal -->
    {#if selectedLightboxIndex >= 0}
      <div 
        class="lightbox-backdrop"
        onclick={closeLightbox}
        role="dialog"
        aria-modal="true"
        aria-label="Elizabeth Photo Viewer"
        tabindex="-1"
        onkeydown={(e) => {
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowRight') nextLightbox();
          if (e.key === 'ArrowLeft') prevLightbox();
        }}
      >
        <div class="lightbox-content" onclick={(e) => e.stopPropagation()} role="presentation">
          <button type="button" class="lightbox-close-btn" onclick={closeLightbox} aria-label="Close">✕</button>
          
          <img 
            src={elizabethMilestones[selectedLightboxIndex].src} 
            alt={elizabethMilestones[selectedLightboxIndex].title}
            class="lightbox-image"
          />

          <div class="lightbox-footer">
            <button type="button" class="lightbox-nav-btn" onclick={prevLightbox} aria-label="Previous Month">❮</button>
            <div class="lightbox-badge-info">
              <span class="lightbox-month-label">{elizabethMilestones[selectedLightboxIndex].label}</span>
              <span class="lightbox-title-text">{elizabethMilestones[selectedLightboxIndex].title}</span>
            </div>
            <button type="button" class="lightbox-nav-btn" onclick={nextLightbox} aria-label="Next Month">❯</button>
          </div>
        </div>
      </div>
    {/if}
  </section>

  <!-- PAGE 5: Royal Location Guide & Navigation Links (The Grand Duke - Freestanding, NO Box, NO Border) -->
  <section class="page-snap-screen page-location">
    <div class="location-mobile-layout">
      <!-- Royal Header -->
      <header class="location-header-info">
        <h2 class="location-walt-title">Royal Directions</h2>
        <p class="location-walt-sub">Your Guide to Elizabeth's Celebration</p>
      </header>

      <!-- The Grand Duke Messenger (Pure Freestanding Character Art, NO box) -->
      <div class="grand-duke-stage">
        <img 
          src="/images/grand-duke-guide.png" 
          alt="The Grand Duke" 
          class="grand-duke-guide-img"
          draggable="false"
        />
        <div class="grand-duke-speech">
          <p class="royal-speech-text">
            "Here is your location, {guestInfo.title ? guestInfo.title + ' ' + guestInfo.firstName : (guestInfo.firstName && guestInfo.firstName !== 'Special Guest' ? guestInfo.firstName : 'Ma’am & Sir')}! Have a safe and pleasant drive!"
          </p>
          <span class="royal-signoff">— The Grand Duke</span>
        </div>
      </div>

      <!-- Navigation Links (Sleek Borderless Direct Action Bars) -->
      <div class="destinations-stack">
        <!-- Destination 1: St. Raphael the Archangel Parish (Church) -->
        <a 
          href="https://www.google.com/maps/dir//St.+Raphael+the+Archangel+Parish,+P.+Rodriguez+St,+Rodriguez,+Rizal/@14.7508621,121.1605998,10804m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3397bb4353f4d05d:0x5af5e36206dfb7ec!2m2!1d121.1586926!2d14.7326638?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          class="destination-btn dest-btn-church"
        >
          <span class="dest-btn-icon">⛪</span>
          <div class="dest-btn-info">
            <span class="dest-btn-tag">Church Ceremony • 10:00 AM</span>
            <span class="dest-btn-name">St. Raphael the Archangel Parish</span>
            <span class="dest-btn-sub">P. Rodriguez St, Rodriguez, Rizal</span>
          </div>
          <span class="dest-btn-arrow">➔</span>
        </a>

        <!-- Destination 2: Green Breeze Phase 2 Clubhouse (Venue) -->
        <a 
          href="https://www.google.com/maps/dir//Green+Breeze+Phase+2+Clubhouse,+Q544%2BCC6,+Rodriguez,+1860+Rizal/@14.7569108,121.159573,4282m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3397a4b17b88cc3d:0x7f16e02218403928!2m2!1d121.1560152!2d14.7560349?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          class="destination-btn dest-btn-venue"
        >
          <span class="dest-btn-icon">🏰</span>
          <div class="dest-btn-info">
            <span class="dest-btn-tag">Reception & Pool Party</span>
            <span class="dest-btn-name">Green Breeze Phase 2 Clubhouse</span>
            <span class="dest-btn-sub">Rodriguez, 1860 Rizal</span>
          </div>
          <span class="dest-btn-arrow">➔</span>
        </a>
      </div>
    </div>
  </section>

  <!-- PAGE 6: Gifts Dedicated Page (Solo Text Only - 100% Borderless & Boxless) -->
  <section class="page-snap-screen page-gifts">
    <div class="gifts-mobile-layout">
      <span class="gifts-royal-tag">👑 A Gentle Note</span>
      <h2 class="gifts-royal-title">Baby Essentials</h2>

      <p class="gifts-solo-message">
        “Your presence on our little Princess Elizabeth's special day is our greatest gift. Should you wish to bless her with a gift, essential baby items are warmly appreciated:”
      </p>

      <div class="essentials-grid">
        <span class="essential-item">🍼 Milk</span>
        <span class="essential-item">🧴 Baby Lotion</span>
        <span class="essential-item">🫧 Body Wash</span>
        <span class="essential-item">🧺 Laundry Detergent</span>
      </div>

      <p class="gifts-thank-you">
        Thank you for your love and blessings! ✨
      </p>
    </div>
  </section>
  </div>
</main>

<style>
  .app-container {
    width: 100vw;
    height: 100dvh;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    position: relative;
    background: #fed7e2;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }

  .app-container.intro-active {
    overflow: hidden !important;
    touch-action: none;
    background: #fed7e2 !important;
  }

  .app-container.home-ready {
    background: #fce4ec url('/images/bg.png') center / contain no-repeat fixed;
  }

  .home-screen-content {
    width: 100%;
    min-height: 100%;
    display: contents;
  }

  .home-screen-content.home-hidden {
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  /* Full Page Snap Section */
  .page-snap-screen {
    width: 100vw;
    min-height: 100dvh;
    height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: normal;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
  }

  /* Cloud strictly on top - clean, no borders or pods */
  .cloud-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    z-index: 30;
    pointer-events: none;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 35%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 35%, transparent 100%);
  }

  /* Stage with Elizabeth */
  .stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: env(safe-area-inset-top, 16px) 0 env(safe-area-inset-bottom, 16px) 0;
    position: relative;
    z-index: 10;
    pointer-events: auto;
  }

  .center-image {
    max-width: 90vw;
    max-height: 82dvh;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: auto;
    filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.18));
  }

  /* PAGE 2, PAGE 3, PAGE 4 & PAGE 5: Modern Church, Venue, Memories & Location Showcases */
  .page-church,
  .page-venue,
  .page-memories,
  .page-location {
    background: transparent;
    border: none;
    outline: none;
    padding: calc(75px + env(safe-area-inset-top, 0px)) 16px calc(65px + env(safe-area-inset-bottom, 0px)) 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .church-mobile-layout {
    width: 100%;
    max-width: min(92vw, 600px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 25;
    pointer-events: auto;
  }

  /* Church Title & Heritage History Text */
  .church-header-info {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
  }

  .church-time-title {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.35rem, 4.8vw, 2.05rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 0.8px;
    color: #e11d48;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 45%, #ff2d55 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(190, 18, 60, 0.25));
    margin: 0;
    text-align: center;
  }

  .church-title {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.5rem, 5.2vw, 2.3rem);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: 0.8px;
    color: #be123c;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 45%, #ff2d55 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 5px rgba(190, 18, 60, 0.28));
    margin: 0;
  }

  .church-desc {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: clamp(0.92rem, 3.4vw, 1.15rem);
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: -0.01em;
    color: #2e101a;
    max-width: 580px;
    margin: 0;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.95);
  }

  /* 4-Panel 3D Curved Perspective Stage (Reference: uploaded mobile mockup) - BORDERLESS & BOXLESS */
  .church-triptych-stage {
    width: 100%;
    max-width: min(98vw, 680px);
    height: clamp(330px, 49vh, 450px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    perspective: 900px;
    perspective-origin: 52% 48%;
    transform-style: preserve-3d;
    margin: 4px auto 0 auto;
    padding: 0;
    position: relative;
    overflow: visible;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .triptych-card {
    min-width: 0;
    border-radius: 8px;
    border: none;
    background: transparent;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    box-shadow: none;
    -webkit-tap-highlight-color: transparent;
    transform-style: preserve-3d;
    transition: 
      flex 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Panel 1: Left Wing (rotated inward, height ~88%) */
  .triptych-card-1 {
    flex: 2.3;
    height: 88%;
    align-self: center;
    transform: rotateY(24deg) scale(0.96);
    transform-origin: right center;
    z-index: 2;
  }

  /* Panel 2: Tall Pillar (highest and lowest reaching card, height 100%) */
  .triptych-card-2 {
    flex: 1.35;
    height: 100%;
    align-self: center;
    transform: rotateY(8deg) skewY(-2deg);
    transform-origin: center center;
    z-index: 3;
  }

  /* Panel 3: Center-Right Hero Showcase (featured ceremony video, height ~94%) */
  .triptych-card-3 {
    flex: 3.8;
    height: 94%;
    align-self: center;
    transform: rotateY(-8deg) skewY(-1.5deg);
    transform-origin: left center;
    z-index: 4;
  }

  /* Panel 4: Right Wing (receding into depth, height ~80%) */
  .triptych-card-4 {
    flex: 1.05;
    height: 80%;
    align-self: center;
    transform: rotateY(-28deg) scale(0.94);
    transform-origin: left center;
    z-index: 1;
  }

  /* Hover effect */
  .triptych-card:hover {
    transform: scale(1.02);
  }

  /* Interactive Tap / Focus Expansion */
  .triptych-card-active {
    flex: 5 !important;
    height: 100% !important;
    transform: rotateY(0deg) skewY(0deg) scale(1.04) translateZ(30px) !important;
    z-index: 20 !important;
    border: none !important;
    box-shadow: none !important;
  }

  .triptych-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
    border: none;
  }

  /* Glassmorphism Title Pill */
  .triptych-label {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
    font-size: clamp(0.65rem, 2vw, 0.78rem);
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 9999px;
    white-space: nowrap;
    letter-spacing: 0.3px;
    border: none;
    box-shadow: none;
    pointer-events: none;
    z-index: 2;
  }

  /* PAGE 3: Venue Videos Direct Layout - BORDERLESS & BOXLESS */
  .venue-mobile-layout {
    width: 100%;
    max-width: min(96vw, 600px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 25;
    pointer-events: auto;
  }

  .venue-header-info {
    width: 100%;
    text-align: center;
    margin-bottom: 4px;
  }

  .venue-title {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(2.3rem, 7.5vw, 3.4rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 1.5px;
    color: #be123c;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 45%, #ff2d55 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 6px rgba(190, 18, 60, 0.3));
    margin: 0;
    text-align: center;
  }

  .venue-location {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: clamp(0.92rem, 3.4vw, 1.15rem);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.01em;
    color: #3b071e;
    margin: 2px 0 6px 0;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.95);
  }

  .venue-videos-grid {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .venue-video-card {
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 36dvh;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background: transparent;
    border: none;
    box-shadow: none;
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    mask-image: radial-gradient(white, black);
    transform: translateZ(0);
  }

  .venue-video-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 16px;
    border: none;
    background: transparent;
  }

  /* PAGE 4: Elizabeth 1-10 Months Mosaic (All 10 at once - 100% BORDERLESS & BOXLESS) */
  .memories-mobile-layout {
    width: 100%;
    max-width: min(98vw, 560px);
    height: 100%;
    max-height: calc(100dvh - 120px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    position: relative;
    z-index: 25;
    pointer-events: auto;
    box-sizing: border-box;
  }

  .memories-header-info {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin-bottom: 2px;
    flex-shrink: 0;
  }

  .memories-script-title {
    font-family: 'Great Vibes', 'Brush Script MT', cursive;
    font-size: clamp(1.2rem, 3.8vw, 1.7rem);
    color: #1e1f20;
    line-height: 1;
    margin-bottom: -4px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12));
  }

  .memories-main-title {
    font-family: 'Playfair Display', Didot, 'Bodoni MT', Georgia, serif;
    font-size: clamp(1.3rem, 4.4vw, 1.95rem);
    font-weight: 900;
    letter-spacing: 2px;
    color: #1e1f20;
    margin: 0;
    line-height: 1.1;
  }

  .memories-mosaic-stage {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(12, 1fr);
    width: 100%;
    max-width: min(98vw, 560px);
    height: clamp(520px, 76vh, 670px);
    gap: 3px;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 8px;
    overflow: hidden;
    margin: 2px 0 0 0;
    box-sizing: border-box;
    touch-action: pan-y;
  }

  .mosaic-item {
    position: relative;
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.2s ease;
  }

  .mosaic-item:hover,
  .mosaic-item:active {
    transform: scale(1.02);
    z-index: 10;
  }

  /* 10 Photos Grid Mapping (3 - 2 - 2 - 3) */
  .mosaic-item-1 { grid-column: 1 / span 2; grid-row: 1 / span 3; }
  .mosaic-item-2 { grid-column: 3 / span 2; grid-row: 1 / span 3; }
  .mosaic-item-3 { grid-column: 5 / span 2; grid-row: 1 / span 3; }

  .mosaic-item-4 { grid-column: 1 / span 3; grid-row: 4 / span 3; }
  .mosaic-item-5 { grid-column: 4 / span 3; grid-row: 4 / span 3; }

  .mosaic-item-6 { grid-column: 1 / span 3; grid-row: 7 / span 3; }
  .mosaic-item-7 { grid-column: 4 / span 3; grid-row: 7 / span 3; }

  .mosaic-item-8 { grid-column: 1 / span 2; grid-row: 10 / span 3; }
  .mosaic-item-9 { grid-column: 3 / span 2; grid-row: 10 / span 3; }
  .mosaic-item-10 { grid-column: 5 / span 2; grid-row: 10 / span 3; }

  .mosaic-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
    border: none;
  }

  .mosaic-badge {
    position: absolute;
    bottom: 4px;
    left: 4px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: clamp(0.55rem, 1.6vw, 0.7rem);
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 9999px;
    border: none;
    box-shadow: none;
    pointer-events: none;
  }

  /* Fullscreen Interactive Lightbox Modal - BORDERLESS & BOXLESS */
  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    animation: fadeInModal 0.25s ease;
  }

  @keyframes fadeInModal {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lightbox-content {
    position: relative;
    max-width: min(96vw, 540px);
    max-height: 92dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 78dvh;
    object-fit: contain;
    border-radius: 10px;
    border: none;
    box-shadow: none;
  }

  .lightbox-close-btn {
    position: absolute;
    top: -14px;
    right: -14px;
    width: 38px;
    height: 38px;
    border-radius: 9999px;
    border: none;
    background: #be123c;
    color: #ffffff;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: none;
    z-index: 10;
  }

  .lightbox-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
  }

  .lightbox-nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: none;
    transition: background 0.2s ease;
  }

  .lightbox-nav-btn:hover,
  .lightbox-nav-btn:active {
    background: rgba(255, 255, 255, 0.45);
  }

  .lightbox-badge-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    gap: 2px;
  }

  .lightbox-month-label {
    font-family: 'Playfair Display', Didot, serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffd54f;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .lightbox-title-text {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.85);
  }

  /* PAGE 5: Royal Directions (Freestanding Grand Duke - 100% BORDERLESS & BOXLESS) */
  .location-mobile-layout {
    width: 100%;
    max-width: min(94vw, 480px);
    height: 100%;
    max-height: calc(100dvh - 120px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    position: relative;
    z-index: 25;
    pointer-events: auto;
    padding: 2px 0 6px 0;
    box-sizing: border-box;
  }

  .location-header-info {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .location-walt-title {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(2rem, 6.8vw, 2.9rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 1.2px;
    color: #be123c;
    background: linear-gradient(135deg, #be123c 0%, #e11d48 45%, #ff2d55 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 6px rgba(190, 18, 60, 0.3));
    margin: 0;
    text-align: center;
  }

  .location-walt-sub {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
    font-size: clamp(0.72rem, 2.3vw, 0.9rem);
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #3b071e;
    margin: 0;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.95);
  }

  /* Freestanding Grand Duke Stage (No card, no box, no border) */
  .grand-duke-stage {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: 1;
    margin: 0 auto;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  .grand-duke-guide-img {
    width: auto;
    height: clamp(210px, 34vh, 310px);
    max-width: 85vw;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    animation: gentleFloat 4s ease-in-out infinite;
    user-select: none;
    -webkit-user-drag: none;
  }

  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .grand-duke-speech {
    width: 100%;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    box-shadow: none;
    background: transparent;
  }

  .royal-speech-text {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: clamp(0.85rem, 2.7vw, 1.05rem);
    font-weight: 700;
    color: #2e101a;
    line-height: 1.35;
    margin: 0;
    text-shadow: 0 1px 4px rgba(255, 255, 255, 0.95);
  }


  .royal-signoff {
    font-family: 'Waltograph', cursive, -apple-system, sans-serif;
    font-size: clamp(1.1rem, 3.4vw, 1.35rem);
    color: #be123c;
    margin-top: 2px;
    display: block;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  }

  /* Navigation Destinations Stack */
  .destinations-stack {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
    flex-shrink: 0;
    margin-bottom: 4px;
  }

  .destination-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: clamp(10px, 2.4vw, 13px) clamp(14px, 3.2vw, 18px);
    border-radius: 9999px;
    border: none;
    box-shadow: none;
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
    transition: transform 0.2s ease, opacity 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .destination-btn:hover {
    transform: translateY(-2px) scale(1.01);
    opacity: 0.95;
  }

  .destination-btn:active {
    transform: scale(0.98);
  }

  .dest-btn-church {
    background: linear-gradient(135deg, #be123c 0%, #e11d48 100%);
    color: #ffffff;
  }

  .dest-btn-venue {
    background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
    color: #ffffff;
  }

  .dest-btn-icon {
    font-size: 1.4rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .dest-btn-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 1px;
  }

  .dest-btn-tag {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: clamp(0.58rem, 1.7vw, 0.68rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }

  .dest-btn-name {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
    font-size: clamp(0.85rem, 2.6vw, 1.02rem);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .dest-btn-sub {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    font-size: clamp(0.65rem, 2vw, 0.75rem);
    opacity: 0.85;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dest-btn-arrow {
    font-size: 1.1rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  /* PAGE 6: Gifts Dedicated Page (Solo Text Only - 100% Borderless & Boxless) */
  .gifts-mobile-layout {
    width: 100%;
    max-width: min(90vw, 400px);
    height: 100%;
    max-height: calc(100dvh - 140px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 25;
    pointer-events: auto;
    text-align: center;
    box-sizing: border-box;
    padding: 0 20px;
    margin: 0 auto;
  }

  .gifts-royal-tag {
    font-family: 'Cinzel', serif;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #9d174d;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
  }

  .gifts-royal-title {
    font-family: 'Waltograph', 'Cinzel Decorative', cursive, sans-serif;
    font-size: clamp(1.8rem, 5.5vw, 2.3rem);
    color: #831843;
    margin: 0;
    line-height: 1.1;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 10px rgba(225, 29, 72, 0.15);
  }

  .gifts-solo-message {
    font-family: 'Playfair Display', Didot, 'Bodoni MT', Georgia, serif;
    font-size: clamp(0.85rem, 2.6vw, 0.96rem);
    font-weight: 600;
    font-style: italic;
    line-height: 1.55;
    letter-spacing: 0.2px;
    color: #2e101a;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.95);
    margin: 0;
    max-width: 310px;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .essentials-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px 14px;
    max-width: 290px;
    margin: 4px 0 2px 0;
  }

  .essential-item {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(0.82rem, 2.5vw, 0.92rem);
    font-weight: 600;
    color: #4a1525;
    background: transparent;
    border: none;
    box-shadow: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.95);
  }

  .gifts-thank-you {
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: clamp(0.8rem, 2.4vw, 0.88rem);
    font-weight: 600;
    color: #9f1239;
    margin: 2px 0 0 0;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
  }

  /* Floating Ambient Elements */
  .floating-elements {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 5;
  }

  /* Balloons */
  .balloon {
    position: absolute;
    bottom: -140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    will-change: transform;
    animation: floatUp infinite linear;
    transform: scale(var(--scale));
    opacity: 0.9;
  }

  .balloon-body {
    width: 44px;
    height: 54px;
    background: radial-gradient(circle at 35% 30%, #ffffff 0%, var(--balloon-color) 45%, rgba(0,0,0,0.2) 100%);
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    box-shadow: inset -2px -4px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.12);
  }

  .balloon-knot {
    width: 6px;
    height: 5px;
    background: var(--balloon-color);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    margin-top: -1px;
  }

  .balloon-string {
    width: 1px;
    height: 48px;
    background: rgba(120, 100, 110, 0.4);
  }

  @keyframes floatUp {
    0% {
      transform: translateY(0) scale(var(--scale)) rotate(-4deg);
      opacity: 0;
    }
    10% {
      opacity: 0.92;
    }
    50% {
      transform: translateY(-60vh) scale(var(--scale)) rotate(4deg);
    }
    90% {
      opacity: 0.92;
    }
    100% {
      transform: translateY(-130vh) scale(var(--scale)) rotate(-3deg);
      opacity: 0;
    }
  }

  /* Floating Hearts */
  .floating-heart {
    position: absolute;
    bottom: -40px;
    color: var(--heart-color);
    will-change: transform;
    animation: floatHeartUp infinite ease-in;
    transform: scale(var(--scale));
    opacity: 0.85;
    filter: drop-shadow(0 2px 6px rgba(255, 77, 109, 0.3));
  }

  @keyframes floatHeartUp {
    0% {
      transform: translateY(0) scale(var(--scale)) rotate(0deg);
      opacity: 0;
    }
    15% {
      opacity: 0.85;
    }
    50% {
      transform: translateY(-55vh) scale(calc(var(--scale) * 1.1)) rotate(8deg);
    }
    85% {
      opacity: 0.85;
    }
    100% {
      transform: translateY(-120vh) scale(var(--scale)) rotate(-8deg);
      opacity: 0;
    }
  }
</style>