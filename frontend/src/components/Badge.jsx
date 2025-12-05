import React from 'react';

const Badge = ({ title = 'LEGEND', score = 100 }) => {
  const getPercentile = (score) => {
    if (score >= 90) return 'TOP 1%';
    if (score >= 75) return 'TOP 5%';
    if (score >= 50) return 'TOP 25%';
    return 'ACTIVE';
  };

  return (
    <div className="relative inline-block group">
      <div className="absolute inset-0 bg-terminal-green blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div className="border-4 border-terminal-green bg-terminal-black px-8 py-4 relative z-10">
        <div className="absolute top-0 left-0 w-2 h-2 bg-terminal-green"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-terminal-green"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-terminal-green"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-terminal-green"></div>
        
        <h2 className="text-2xl md:text-3xl font-pixel text-terminal-green pixel-text-shadow tracking-wider text-center">
          {title}
        </h2>
        <div className="text-center text-xs font-mono mt-2 text-terminal-green/80">
          {getPercentile(score)} CONTRIBUTOR
        </div>
        <div className="text-center text-terminal-amber font-pixel text-sm mt-1">
          SCORE: {score}
        </div>
      </div>
    </div>
  );
};

export default Badge;
