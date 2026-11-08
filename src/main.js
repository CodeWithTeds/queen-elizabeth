import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';
import { preloadHeroSingleFlight } from './singleFlight.js';

// Launch single-flight preload for hero assets immediately on bundle load
preloadHeroSingleFlight();

// Background music, independent of the Svelte component tree
const music = document.createElement('audio');
music.src = '/images/bg-music.mp3';
music.loop = true;
music.preload = 'auto';
music.volume = 0.55;
document.body.appendChild(music);

const playMusic = () => {
  if (!music.paused) return;
  music.play().catch(() => {});
};

// Try to start right away; if the browser blocks autoplay,
// start on the first tap, click or key press.
playMusic();

const unlockMusic = () => {
  playMusic();
  window.removeEventListener('pointerdown', unlockMusic);
  window.removeEventListener('touchstart', unlockMusic);
  window.removeEventListener('keydown', unlockMusic);
};

window.addEventListener('pointerdown', unlockMusic, { passive: true });
window.addEventListener('touchstart', unlockMusic, { passive: true });
window.addEventListener('keydown', unlockMusic);

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
