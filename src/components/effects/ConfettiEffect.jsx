import { useEffect } from 'react';
import confetti from 'canvas-confetti';

// eslint-disable-next-line react-refresh/only-export-components
export function useConfetti() {
  const fireConfetti = (options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#75ACEC', '#FFFFFF', '#F6BF3B', '#5BA3D9', '#FFE08A']
    };
    
    confetti({
      ...defaults,
      ...options
    });
  };
  
  const fireWin = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#75ACEC', '#FFFFFF', '#F6BF3B']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#75ACEC', '#FFFFFF', '#F6BF3B']
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };
  
  const fireImposter = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#EF6A6A', '#FF9999', '#FFCCCC'],
      scalar: 1.2
    });
  };
  
  const fireArgentina = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#75ACEC', '#FFFFFF', '#F6BF3B'];
    
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };
  
  return { fireConfetti, fireWin, fireImposter, fireArgentina };
}

export function ConfettiEffect({ trigger = false, type = 'default' }) {
  const { fireWin, fireImposter, fireArgentina, fireConfetti } = useConfetti();
  
  useEffect(() => {
    if (trigger) {
      if (type === 'win') fireWin();
      else if (type === 'imposter') fireImposter();
      else if (type === 'argentina') fireArgentina();
      else fireConfetti();
    }
  }, [trigger, type, fireWin, fireImposter, fireArgentina, fireConfetti]);
  
  return null;
}