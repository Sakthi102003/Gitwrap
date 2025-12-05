import React, { useState, useEffect } from 'react';
import TerminalWindow from './components/TerminalWindow';
import StatsGrid from './components/StatsGrid';
import Heatmap from './components/Heatmap';
import ActivityChart from './components/ActivityChart';
import TopLanguages from './components/TopLanguages';
import TopRepos from './components/TopRepos';
import Badge from './components/Badge';
import ShareCard from './components/ShareCard';
import { fetchWrappedData } from './services/api';

function App() {
  const [showShare, setShowShare] = useState(false);
  const [wrappedData, setWrappedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchUsername, setSearchUsername] = useState('');

  const handleFetchData = async () => {
    if (!searchUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWrappedData(searchUsername, year);
      setWrappedData(data);
      setUsername(searchUsername);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setWrappedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative pb-24">
      {/* CRT Overlay */}
      <div className="crt-overlay pointer-events-none"></div>
      <div className="crt-flicker pointer-events-none fixed inset-0 bg-white/5 opacity-[0.02] z-40"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <div className="inline-block border-b-4 border-terminal-green pb-4 px-8">
            <h1 className="text-4xl md:text-6xl font-pixel text-terminal-green mb-4 pixel-text-shadow animate-pulse-slow">
              GITHUB WRAPPED <span className="text-terminal-amber">2025</span>
            </h1>
          </div>
        </header>

        {/* Search Input */}
        {!wrappedData && (
          <div className="mb-12">
            <TerminalWindow title="LOAD_USER_DATA">
              <div className="space-y-4">
                <div className="font-mono text-terminal-green">
                  <span className="text-terminal-amber">&gt;</span> Enter GitHub username to analyze:
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFetchData()}
                    placeholder="octocat"
                    className="flex-1 bg-terminal-black border-2 border-terminal-green text-terminal-green px-4 py-2 font-mono focus:outline-none focus:border-terminal-amber"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min="2008"
                    max={new Date().getFullYear()}
                    className="w-24 bg-terminal-black border-2 border-terminal-green text-terminal-green px-4 py-2 font-mono focus:outline-none focus:border-terminal-amber"
                    disabled={loading}
                  />
                  <button
                    onClick={handleFetchData}
                    disabled={loading}
                    className="px-6 py-2 bg-terminal-green text-terminal-black font-pixel text-xs hover:bg-terminal-green/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'LOADING...' : 'FETCH_DATA'}
                  </button>
                </div>
                {error && (
                  <div className="text-terminal-red font-mono">
                    ERROR: {error}
                  </div>
                )}
              </div>
            </TerminalWindow>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block border-2 border-terminal-green p-8">
              <div className="text-terminal-green font-pixel text-xl animate-pulse">
                LOADING DATA...
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-3 h-3 bg-terminal-green animate-pulse"></div>
                <div className="w-3 h-3 bg-terminal-green animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-terminal-green animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Header */}
        {wrappedData && (
          <div className="mb-8 text-center">
            <div className="inline-block border-b-2 border-terminal-green pb-4 px-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 border-2 border-terminal-green p-1">
                  <img 
                    src={wrappedData.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-pixel text-terminal-green">@{wrappedData.username}</div>
                  <div className="text-terminal-green/60 font-mono">&gt; {wrappedData.name}</div>
                </div>
              </div>
              <button
                onClick={() => { setWrappedData(null); setSearchUsername(''); }}
                className="mt-4 text-terminal-green/60 font-mono text-sm hover:text-terminal-green"
              >
                [Change User]
              </button>
            </div>
          </div>
        )}

        {/* Main Grid */}
        {wrappedData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <StatsGrid data={wrappedData} />
            <Heatmap data={wrappedData.heatmapDays} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ActivityChart data={wrappedData} />
              <TopLanguages languages={wrappedData.topLanguages} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex justify-center py-8">
              <Badge title={wrappedData.title} score={wrappedData.vibe_score} />
            </div>
            <TopRepos repos={wrappedData.topRepos} />
            
            <TerminalWindow title="SYSTEM_STATUS">
              <div className="space-y-2 font-mono text-sm text-terminal-green/80">
                <div className="flex justify-between">
                  <span>STREAK:</span>
                  <span>{wrappedData.streak} DAYS</span>
                </div>
                <div className="flex justify-between">
                  <span>INTENSITY:</span>
                  <span>{wrappedData.intensity} C/DAY</span>
                </div>
                <div className="flex justify-between">
                  <span>VIBE:</span>
                  <span className={wrappedData.vibe_score > 70 ? "text-terminal-green" : "text-terminal-amber"}>{wrappedData.vibe_score}/100</span>
                </div>
                {wrappedData.productiveMonth && (
                  <div className="flex justify-between">
                    <span>PEAK MONTH:</span>
                    <span>{wrappedData.productiveMonth.month}</span>
                  </div>
                )}
              </div>
            </TerminalWindow>
          </div>
        </div>
        )}

        {/* Footer Actions */}
        {wrappedData && (
        <footer className="fixed bottom-0 left-0 w-full bg-terminal-black border-t-2 border-terminal-green p-4 z-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-mono text-terminal-green/60">
              <span className="text-terminal-green">$</span> {wrappedData.cached ? '[CACHED]' : '[LIVE]'} {wrappedData.username} // {wrappedData.year}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowShare(true)}
                className="px-6 py-2 bg-terminal-green text-terminal-black font-pixel text-xs hover:bg-terminal-green/80 transition-colors"
              >
                GENERATE_CARD
              </button>
              <button className="px-6 py-2 border-2 border-terminal-green text-terminal-green font-pixel text-xs hover:bg-terminal-green/10 transition-colors">
                SHARE_URL
              </button>
            </div>
          </div>
        </footer>
        )}

        {/* Share Modal Overlay */}
        {showShare && wrappedData && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setShowShare(false)}>
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowShare(false)}
                className="absolute -top-12 right-0 text-terminal-green font-pixel hover:text-white"
              >
                [X] CLOSE
              </button>
              <ShareCard data={wrappedData} />
              <div className="text-center mt-4 text-terminal-green/60 font-mono text-sm">
                Right click &gt; Save Image As...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
