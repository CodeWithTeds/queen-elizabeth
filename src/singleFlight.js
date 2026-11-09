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

    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve(true);
      }
    };

    // Safety timeout: never block navigation if network/decoding takes too long
    const timeoutTimer = setTimeout(finish, 650);

    try {
      const img = new Image();
      img.src = '/images/welcome.webp';
      if (typeof img.decode === 'function') {
        img.decode().then(finish).catch(finish);
      } else {
        img.onload = finish;
        img.onerror = finish;
      }
    } catch (_) {
      finish();
    }
  });

  return heroFlightPromise;
}
