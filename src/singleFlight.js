// Single-Flight Coordinator for Elizabeth Hero Assets
let heroFlightPromise = null;

export function preloadHeroSingleFlight() {
  if (heroFlightPromise) {
    return heroFlightPromise;
  }

  heroFlightPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(true);
      return;
    }

    // 1. Single flight for hero image (main-page.avif)
    const img = new Image();
    img.src = '/images/main-page.avif';

    const onHeroDone = () => {
      // 2. Also pre-decode background image in same flight
      const bgImg = new Image();
      bgImg.src = '/images/bg.png';
      if (typeof bgImg.decode === 'function') {
        bgImg.decode().catch(() => {}).finally(() => resolve(true));
      } else {
        bgImg.onload = () => resolve(true);
        bgImg.onerror = () => resolve(true);
      }
    };

    if (typeof img.decode === 'function') {
      img.decode().then(onHeroDone).catch(onHeroDone);
    } else {
      img.onload = onHeroDone;
      img.onerror = onHeroDone;
    }
  });

  return heroFlightPromise;
}
