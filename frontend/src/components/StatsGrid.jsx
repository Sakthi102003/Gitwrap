import React from 'react';
import PixelCard from './PixelCard';

const StatsGrid = ({ data }) => {
  const stats = [
    { label: 'COMMITS', value: data.totalCommits.toLocaleString(), icon: '>' },
    { label: 'PRs', value: data.totalPRs.toLocaleString(), icon: '+' },
    { label: 'ISSUES', value: data.totalIssues.toLocaleString(), icon: '!' },
    { label: 'REPOS', value: data.repoCount.toLocaleString(), icon: '#' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats.map((stat) => (
        <PixelCard key={stat.label} className="flex flex-col items-center justify-center py-6">
          <span className="text-terminal-dim text-4xl mb-2 font-pixel">{stat.icon}</span>
          <span className="text-3xl font-pixel mb-1 text-terminal-green pixel-text-shadow">{stat.value}</span>
          <span className="text-sm text-terminal-green/80">{stat.label}</span>
        </PixelCard>
      ))}
    </div>
  );
};

export default StatsGrid;
