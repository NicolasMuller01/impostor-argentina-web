export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const springConfigs = {
  gentle: { stiffness: 120, damping: 14 },
  bouncy: { stiffness: 300, damping: 20 },
  stiff: { stiffness: 400, damping: 30 },
  slow: { stiffness: 100, damping: 26 }
};

export const easeOutExpo = [0.22, 1, 0.36, 1];
export const easeInOutExpo = [0.87, 0, 0.13, 1];