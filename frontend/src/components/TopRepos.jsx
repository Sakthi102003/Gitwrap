import React from 'react';
import TerminalWindow from './TerminalWindow';

const TopRepos = ({ repos = [] }) => {

  return (
    <TerminalWindow title="TOP_REPOS" className="mb-8">
      <div className="font-mono text-sm space-y-2">
        {repos.map((repo, i) => (
          <div key={i} className="border-b border-terminal-green/20 pb-2 last:border-0 hover:bg-terminal-green/5 p-2 cursor-pointer transition-colors">
            <div className="flex justify-between items-center mb-1">
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-terminal-green font-bold hover:text-terminal-amber transition-colors">&gt; {repo.name}</a>
              <span className="text-terminal-amber">⭐ {repo.stars}</span>
            </div>
            <div className="flex justify-between text-terminal-green/60 text-xs">
              <span>[{repo.language || 'N/A'}]</span>
              <span className="truncate ml-2">{repo.description?.substring(0, 30) || 'No description'}</span>
            </div>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
};

export default TopRepos;
