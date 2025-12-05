import React from 'react';
import Badge from './Badge';

const ShareCard = ({ data }) => {
  if (!data) return null;

  const topLanguage = data.topLanguages?.[0]?.name || 'N/A';
  
  return (
    <div className="w-[360px] h-[450px] bg-terminal-black border-4 border-terminal-green p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-50"></div>
      
      <div className="z-20 flex flex-col h-full">
        <div className="text-center border-b-2 border-terminal-green pb-4 mb-4">
          <h1 className="text-2xl font-pixel text-terminal-green mb-2">GITHUB WRAPPED</h1>
          <div className="text-terminal-green/60 font-mono text-sm">{data.year} EDITION</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-24 h-24 border-2 border-terminal-green p-1">
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full grayscale contrast-125 brightness-75" />
          </div>
          
          <div className="text-center">
            <div className="text-xl font-pixel text-terminal-green mb-1">@{data.username}</div>
            <div className="text-sm font-mono text-terminal-green/60">{data.name}</div>
          </div>

          <Badge title={data.title} score={data.vibe_score} />
        </div>

        <div className="mt-auto pt-4 border-t-2 border-terminal-green">
          <div className="flex justify-between text-xs font-mono text-terminal-green/60">
            <span>COMMITS: {data.totalCommits.toLocaleString()}</span>
            <span>TOP: {topLanguage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
