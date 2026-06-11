import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Panel — precise, sharp card for the Linear aesthetic.
 */
const GlassCard = ({ children, className = '', hover = false }) => (
  <div
    className={cn(
      'bg-bg-secondary rounded-lg border border-border shadow-card transition-shadow duration-200',
      hover && 'hover:shadow-card-md',
      className
    )}
  >
    {children}
  </div>
);

export default GlassCard;
