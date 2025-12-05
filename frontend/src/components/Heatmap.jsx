import React from 'react';
import TerminalWindow from './TerminalWindow';

const Heatmap = ({ data = [] }) => {
  // Group days by week
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  
  // Get color intensity based on contribution count
  const getColorClass = (count) => {
    if (count === 0) return 'bg-terminal-green/10';
    if (count >= 10) return 'bg-terminal-green';
    if (count >= 5) return 'bg-terminal-green/70';
    if (count >= 2) return 'bg-terminal-green/40';
    return 'bg-terminal-green/20';
  };
  
  return (
    <TerminalWindow title="CONTRIBUTIONS.EXE" className="mb-8">
      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-1">
            {week.map((day, d) => (
              <div 
                key={d} 
                className={`w-3 h-3 ${getColorClass(day.count)} hover:border hover:border-white transition-colors cursor-pointer`}
                title={`${day.date}: ${day.count} contributions`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2 text-terminal-green/60 font-mono">
        <span>Jan</span>
        <span>Dec</span>
      </div>
    </TerminalWindow>
  );
};

export default Heatmap;
