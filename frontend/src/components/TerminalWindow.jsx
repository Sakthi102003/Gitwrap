import React from 'react';

const TerminalWindow = ({ title, children, className = '' }) => {
  return (
    <div className={`border-2 border-terminal-green bg-terminal-black relative ${className}`}>
      <div className="bg-terminal-green text-terminal-black px-2 py-1 font-pixel text-xs flex justify-between items-center">
        <span>{title}</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-terminal-black"></div>
          <div className="w-3 h-3 bg-terminal-black"></div>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;
