import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animations';

export function Button3D({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  icon,
  className = '',
  ...props 
}) {
  const shouldAnimate = !prefersReducedMotion();
  
  const baseStyles = {
    primary: 'btn-3d-primary',
    secondary: 'btn-3d-secondary',
    ghost: 'btn-3d-ghost',
    danger: 'btn-3d-danger'
  };
  
  const MotionButton = shouldAnimate ? motion.button : 'button';
  
  const animationProps = shouldAnimate ? {
    whileHover: disabled ? {} : { scale: 1.02, y: -2 },
    whileTap: disabled ? {} : { scale: 0.97, y: 1 },
    transition: { type: 'spring', stiffness: 400, damping: 20 }
  } : {};
  
  return (
    <MotionButton
      type="button"
      className={`btn-3d ${baseStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...animationProps}
      {...props}
    >
      {icon && <span className="btn-3d-icon">{icon}</span>}
      {children}
    </MotionButton>
  );
}

export function GlowButton({ children, onClick, disabled = false, pulse = false, className = '' }) {
  const shouldAnimate = !prefersReducedMotion();
  
  const MotionButton = shouldAnimate ? motion.button : 'button';
  
  const animationProps = shouldAnimate ? {
    whileHover: disabled ? {} : { scale: 1.03 },
    whileTap: disabled ? {} : { scale: 0.97 },
    animate: pulse && !disabled ? {
      boxShadow: [
        '0 0 0 0 rgba(246, 191, 59, 0.4)',
        '0 0 0 8px rgba(246, 191, 59, 0)',
        '0 0 0 0 rgba(246, 191, 59, 0)'
      ]
    } : {},
    transition: pulse ? {
      boxShadow: { duration: 1.5, repeat: Infinity }
    } : { type: 'spring', stiffness: 400, damping: 20 }
  } : {};
  
  return (
    <MotionButton
      type="button"
      className={`glow-btn ${pulse ? 'glow-btn-pulse' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...animationProps}
    >
      {children}
    </MotionButton>
  );
}