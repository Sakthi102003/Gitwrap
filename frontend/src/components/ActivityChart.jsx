import React from 'react';
import TerminalWindow from './TerminalWindow';

const ActivityChart = ({ data }) => {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  
  // Calculate monthly contributions from heatmap data
  const monthlyData = Array(12).fill(0);
  
  if (data?.heatmapDays && Array.isArray(data.heatmapDays)) {
    data.heatmapDays.forEach(day => {
      try {
        // Parse the date and extract month (0-11)
        const dateStr = day.date;
        const month = parseInt(dateStr.split('-')[1]) - 1; // Convert MM to 0-11
        if (month >= 0 && month < 12) {
          monthlyData[month] += day.count || 0;
        }
      } catch (e) {
        // Skip invalid dates
        console.warn('Invalid date in heatmap:', day.date);
      }
    });
  }
  
  // Find max for scaling (ensure at least 1 to avoid division by zero)
  const maxContributions = Math.max(...monthlyData, 1);
  const hasData = monthlyData.some(count => count > 0);
  
  return (
    <TerminalWindow title="ACTIVITY_LOG" className="h-full">
      <div className="flex items-end justify-between h-40 gap-2">
        {months.map((m, i) => {
          const height = monthlyData[i] > 0 ? Math.max((monthlyData[i] / maxContributions) * 100, 2) : 0;
          const contributions = monthlyData[i];
          
          return (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="w-full bg-terminal-green/20 relative h-full flex items-end group-hover:bg-terminal-green/30 transition-colors">
                {contributions > 0 ? (
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-terminal-green relative cursor-pointer transition-all"
                    title={`${m}: ${contributions} contributions`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-1 bg-terminal-green/40"
                    title={`${m}: No contributions`}
                  ></div>
                )}
              </div>
              <span className="mt-2 text-xs font-mono text-terminal-green/60">{m}</span>
            </div>
          );
        })}
      </div>
      {!hasData && (
        <div className="mt-4 text-center text-terminal-green/40 text-xs font-mono">
          No activity data available for this year
        </div>
      )}
    </TerminalWindow>
  );
};

export default ActivityChart;
