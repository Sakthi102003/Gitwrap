import React from 'react';

const PixelCard = ({ children, className = '', variant = 'default' }) => {
  const borderClass = variant === 'danger' ? 'border-terminal-red' : 
                      variant === 'warning' ? 'border-terminal-amber' : 
                      'border-terminal-green';
  
  return (
    <div className={`border-2 ${borderClass} bg-terminal-dark p-4 relative ${className}`}>
      {/* Corner accents */}
      <div className={`absolute -top-1 -left-1 w-2 h-2 ${borderClass} bg-current`}></div>
      <div className={`absolute -top-1 -right-1 w-2 h-2 ${borderClass} bg-current`}></div>
      <div className={`absolute -bottom-1 -left-1 w-2 h-2 ${borderClass} bg-current`}></div>
      <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${borderClass} bg-current`}></div>
      {children}
    </div>
  );
};

export default PixelCard;
