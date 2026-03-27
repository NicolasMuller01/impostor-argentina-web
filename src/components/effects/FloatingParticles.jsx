import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animations';

export function FloatingParticles({ 
  count = 20, 
  colors = ['#75ACEC', '#F6BF3B', '#FFFFFF'],
  className = ''
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 37 + 13) % 100,
      delay: (i * 17 + 7) % 5,
      duration: 3 + ((i * 23 + 11) % 4),
      size: 4 + ((i * 19 + 5) % 8),
      color: colors[i % colors.length]
    }));
  }, [count, colors]);
  
  if (!shouldAnimate) {
    return null;
  }
  
  return (
    <div className={`floating-particles ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

export function FloatingIcon({ 
  icon, 
  size = 48, 
  color = '#F6BF3B',
  className = ''
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  if (!shouldAnimate) {
    return (
      <div className={className} style={{ fontSize: size, color }}>
        {icon}
      </div>
    );
  }
  
  return (
    <motion.div
      className={className}
      style={{ fontSize: size, color }}
      animate={{
        y: [0, -10, 0],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {icon}
    </motion.div>
  );
}

export function PulseGlow({ 
  children, 
  color = 'rgba(246, 191, 59, 0.4)',
  className = ''
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}`,
          `0 0 0 15px transparent`,
          `0 0 0 0 transparent`
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    >
      {children}
    </motion.div>
  );
}

export function ShimmerText({ children, className = '' }) {
  const shouldAnimate = !prefersReducedMotion();
  
  if (!shouldAnimate) {
    return <span className={className}>{children}</span>;
  }
  
  return (
    <motion.span
      className={`shimmer-text ${className}`}
      animate={{
        backgroundPosition: ['200% center', '-200% center']
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
      }}
    >
      {children}
    </motion.span>
  );
}