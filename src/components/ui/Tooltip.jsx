import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';

export function Tooltip({ content, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right'
  };
  
 return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`tooltip-content ${positions[position]}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InfoTooltip({ text, className = '' }) {
  return (
    <Tooltip content={text}>
      <FaInfoCircle className={`info-tooltip-icon ${className}`} />
    </Tooltip>
  );
}

export function HelpLabel({ children, helpText }) {
  return (
    <div className="help-label">
      <span>{children}</span>
      {helpText && <InfoTooltip text={helpText} />}
    </div>
  );
}