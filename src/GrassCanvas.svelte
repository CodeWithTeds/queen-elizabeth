<!-- Ultra-lightweight Static SVG Flower Garden (0 canvas memory, 0 CPU draw calls) -->
<div class="grass-fixed-container" aria-hidden="true">
  <svg 
    viewBox="0 0 1200 130" 
    preserveAspectRatio="none" 
    class="garden-svg"
  >
    <defs>
      <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" stop-color="#4caf50" stop-opacity="0.6" />
        <stop offset="60%" stop-color="#388e3c" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#2e7d32" stop-opacity="1" />
      </linearGradient>
    </defs>

    <!-- Ground Mound -->
    <path 
      d="M0,130 L0,95 Q300,82 600,92 T1200,90 L1200,130 Z" 
      fill="url(#ground-grad)" 
    />

    <!-- Gentle Grass Blades -->
    <path d="M40,110 Q50,70 65,55 Q55,75 50,110 Z" fill="#66bb6a" />
    <path d="M120,115 Q135,75 150,60 Q138,80 130,115 Z" fill="#4caf50" />
    <path d="M220,110 Q210,65 195,50 Q212,70 230,110 Z" fill="#81c784" />
    <path d="M340,112 Q355,68 375,52 Q360,74 350,112 Z" fill="#4caf50" />
    <path d="M460,115 Q450,72 435,58 Q452,76 470,115 Z" fill="#66bb6a" />
    <path d="M580,110 Q595,65 615,48 Q600,72 590,110 Z" fill="#81c784" />
    <path d="M700,114 Q690,70 670,54 Q692,75 710,114 Z" fill="#4caf50" />
    <path d="M820,110 Q835,68 855,50 Q840,74 830,110 Z" fill="#66bb6a" />
    <path d="M940,115 Q930,72 915,56 Q932,76 950,115 Z" fill="#81c784" />
    <path d="M1060,110 Q1075,65 1095,48 Q1080,72 1070,110 Z" fill="#4caf50" />
    <path d="M1160,112 Q1150,70 1135,55 Q1152,74 1170,112 Z" fill="#66bb6a" />

    <!-- Blooming Fairytale Flowers across the bottom -->
    <!-- Flower 1: Pink Rose -->
    <g transform="translate(85, 82)">
      <path d="M0,35 Q-5,15 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-5" cy="-4" r="7" fill="#ff4d6d" />
      <circle cx="5" cy="-4" r="7" fill="#ff4d6d" />
      <circle cx="0" cy="5" r="7" fill="#ff2d55" />
      <circle cx="0" cy="0" r="5" fill="#ffd54f" />
    </g>

    <!-- Flower 2: Golden Blossom -->
    <g transform="translate(200, 78)">
      <path d="M0,38 Q6,18 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-6" cy="0" r="6" fill="#ffd166" />
      <circle cx="6" cy="0" r="6" fill="#ffd166" />
      <circle cx="0" cy="-6" r="6" fill="#ffd166" />
      <circle cx="0" cy="6" r="6" fill="#ffd166" />
      <circle cx="0" cy="0" r="4.5" fill="#5d4037" />
    </g>

    <!-- Flower 3: Soft Daisy -->
    <g transform="translate(320, 84)">
      <path d="M0,32 Q-4,14 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-5" cy="-3" r="6" fill="#ffffff" />
      <circle cx="5" cy="-3" r="6" fill="#ffffff" />
      <circle cx="0" cy="4" r="6" fill="#ffffff" />
      <circle cx="0" cy="0" r="4" fill="#fbc02d" />
    </g>

    <!-- Flower 4: Ruby Rose -->
    <g transform="translate(450, 76)">
      <path d="M0,40 Q5,18 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-6" cy="-4" r="7.5" fill="#e11d48" />
      <circle cx="6" cy="-4" r="7.5" fill="#e11d48" />
      <circle cx="0" cy="5" r="7.5" fill="#be123c" />
      <circle cx="0" cy="0" r="5" fill="#ffd54f" />
    </g>

    <!-- Flower 5: Lavender Bell -->
    <g transform="translate(570, 80)">
      <path d="M0,36 Q-6,16 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-5" cy="0" r="6" fill="#ba68c8" />
      <circle cx="5" cy="0" r="6" fill="#ba68c8" />
      <circle cx="0" cy="-5" r="6" fill="#ce93d8" />
      <circle cx="0" cy="5" r="6" fill="#ab47bc" />
      <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
    </g>

    <!-- Flower 6: White Daisy -->
    <g transform="translate(700, 78)">
      <path d="M0,38 Q5,18 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-5" cy="-4" r="6.5" fill="#ffffff" />
      <circle cx="5" cy="-4" r="6.5" fill="#ffffff" />
      <circle cx="0" cy="5" r="6.5" fill="#ffffff" />
      <circle cx="0" cy="0" r="4.5" fill="#ffd54f" />
    </g>

    <!-- Flower 7: Pink Blossom -->
    <g transform="translate(830, 82)">
      <path d="M0,34 Q-4,15 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-6" cy="-4" r="7" fill="#ff758f" />
      <circle cx="6" cy="-4" r="7" fill="#ff758f" />
      <circle cx="0" cy="5" r="7" fill="#ff4d6d" />
      <circle cx="0" cy="0" r="4.5" fill="#ffd54f" />
    </g>

    <!-- Flower 8: Golden Sunflower -->
    <g transform="translate(960, 75)">
      <path d="M0,40 Q5,18 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-6" cy="0" r="6" fill="#ffd166" />
      <circle cx="6" cy="0" r="6" fill="#ffd166" />
      <circle cx="0" cy="-6" r="6" fill="#ffd166" />
      <circle cx="0" cy="6" r="6" fill="#ffd166" />
      <circle cx="0" cy="0" r="4" fill="#5d4037" />
    </g>

    <!-- Flower 9: Rosebud -->
    <g transform="translate(1085, 80)">
      <path d="M0,36 Q-5,16 0,0" stroke="#2e7d32" stroke-width="2.5" fill="none" />
      <circle cx="-5" cy="-4" r="6.5" fill="#ff4d6d" />
      <circle cx="5" cy="-4" r="6.5" fill="#ff4d6d" />
      <circle cx="0" cy="4" r="6.5" fill="#e11d48" />
      <circle cx="0" cy="0" r="4" fill="#ffd54f" />
    </g>
  </svg>
</div>

<style>
  .grass-fixed-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 95px;
    z-index: 20;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  .garden-svg {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 -2px 6px rgba(0, 0, 0, 0.06));
  }
</style>
