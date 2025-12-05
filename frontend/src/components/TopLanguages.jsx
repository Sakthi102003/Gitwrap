import React from 'react';
import TerminalWindow from './TerminalWindow';

const TopLanguages = ({ languages = [] }) => {
  const langs = languages.slice(0, 5);

  return (
    <TerminalWindow title="LANG_STATS" className="h-full">
      <div className="space-y-4">
        {langs.map((lang) => (
          <div key={lang.name}>
            <div className="flex justify-between text-sm mb-1 font-mono">
              <span>{lang.name}</span>
              <span>{lang.percentage}%</span>
            </div>
            <div className="h-4 bg-terminal-green/10 border border-terminal-green/30 p-0.5">
              <div 
                className="h-full bg-terminal-green relative"
                style={{ width: `${lang.percentage}%` }}
              >
                {/* Pixel texture */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=')] opacity-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
};

export default TopLanguages;
