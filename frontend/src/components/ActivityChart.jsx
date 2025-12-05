import React from 'react';
import TerminalWindow from './TerminalWindow';

const ActivityChart = ({ data }) => {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  
  // Calculate monthly contributions from heatmap data
  const monthlyData = Array(12).fill(0);
  
  if (data?.heatmapDays) {
    data.heatmapDays.forEach(day => {
      const month = new Date(day.date).getMonth();
      monthlyData[month] += day.count;
    });
  }
  
  // Find max for scaling
  const maxContributions = Math.max(...monthlyData, 1);
  
  return (
    <TerminalWindow title="ACTIVITY_LOG" className="h-full">
      <div className="flex items-end justify-between h-40 gap-2">
        {months.map((m, i) => {
          const height = (monthlyData[i] / maxContributions) * 100;
          const contributions = monthlyData[i];
          
          return (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="w-full bg-terminal-green/20 relative h-full flex items-end group-hover:bg-terminal-green/30 transition-colors">
                <div 
                  style={{ height: `${height}%` }} 
                  className="w-full bg-terminal-green relative cursor-pointer"
                  title={`${m}: ${contributions} contributions`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                </div>
              </div>
              <span className="mt-2 text-xs font-mono">{m}</span>
            </div>
          );
        })}
      </div>
    </TerminalWindow>
  );
};

export default ActivityChart;
