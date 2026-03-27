// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animations';

export function FlipCard({ 
  frontContent, 
  backContent, 
  isFlipped = false, 
  onFlip,
  variant = 'default',
  className = ''
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  const variants = {
    default: 'flip-card-default',
    imposter: 'flip-card-imposter',
    citizen: 'flip-card-citizen',
    fact: 'flip-card-fact'
  };
  
  return (
    <div className={`flip-card-container ${className}`}>
      <motion.div
        className={`flip-card-inner ${variants[variant]}`}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={shouldAnimate ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
        onClick={onFlip}
        style={{ cursor: onFlip ? 'pointer' : 'default' }}
      >
        <div className="flip-card-front">
          {frontContent}
        </div>
        <div className="flip-card-back">
          {backContent}
        </div>
      </motion.div>
    </div>
  );
}

export function RevealCard({ 
  isRevealed, 
  isImposter = false, 
  isFactMode = false,
  word, 
  fact,
  category,
  categoryIcon,
  hint,
  showHint = false,
  onReveal 
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  const variant = isFactMode 
    ? (isImposter ? 'fact-imposter' : 'fact-citizen')
    : (isImposter ? 'imposter' : 'citizen');
  
  return (
    <motion.div
      className={`reveal-card-3d reveal-card-3d-${variant}`}
      onClick={onReveal}
      initial={false}
      animate={{ 
        rotateY: isRevealed ? 180 : 0,
        scale: isRevealed ? 0.98 : 1
      }}
      transition={shouldAnimate ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      whileHover={shouldAnimate ? { scale: isRevealed ? 0.98 : 1.02 } : {}}
      whileTap={shouldAnimate ? { scale: 0.96 } : {}}
    >
      <div className="reveal-card-3d-face reveal-card-3d-front">
        <motion.div
          animate={shouldAnimate ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="reveal-card-icon">👁️</span>
        </motion.div>
        <span className="reveal-card-hint">Toca para revelar</span>
      </div>
      
      <div className="reveal-card-3d-face reveal-card-3d-back">
        <span className="reveal-card-role">
          {isImposter ? '👹 Impostor' : '✅ Ciudadano'}
        </span>
        {!isFactMode ? (
          <>
            <span className="reveal-card-category">{category}</span>
            <h4 className="reveal-card-word">
              {isImposter ? 'Adivina la palabra...' : word}
            </h4>
            {hint && showHint && isImposter && (
              <span className="reveal-card-hint-text">💡 {hint}</span>
            )}
          </>
        ) : (
          <>
            {isImposter ? (
              <>
                <h4 className="reveal-card-word">Inventa un dato</h4>
                <span className="reveal-card-hint-text">Que suene convincente</span>
              </>
            ) : (
              <>
                <span className="reveal-card-category">{categoryIcon} {category}</span>
                <h4 className="reveal-card-fact">{fact}</h4>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export function Card3D({ 
  children, 
  onClick, 
  className = '',
  hover3D = true,
  glow = false 
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <motion.div
      className={`card-3d ${glow ? 'card-3d-glow' : ''} ${className}`}
      onClick={onClick}
      initial={false}
      whileHover={shouldAnimate && hover3D ? {
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
        boxShadow: '0 20px 40px rgba(38, 148, 232, 0.2)'
      } : {}}
      whileTap={shouldAnimate ? { scale: 0.98 } : {}}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}