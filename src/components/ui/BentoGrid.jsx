import React from 'react';
import { cn } from '../../utils/cn';

const BentoGrid = ({ children, className = '' }) => {
  return (
    <div className={cn(
      'grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(180px,auto)]',
      className
    )}>
      {children}
    </div>
  );
};

export const BentoItem = ({ children, className = '', span = 'col-span-1' }) => {
  return (
    <div className={cn(span, className)}>
      {children}
    </div>
  );
};

export default BentoGrid;
