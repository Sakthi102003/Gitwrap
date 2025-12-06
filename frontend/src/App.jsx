import React, { useState } from 'react';
import TerminalWindow from './components/TerminalWindow';
import StatsGrid from './components/StatsGrid';
import Heatmap from './components/Heatmap';
import ActivityChart from './components/ActivityChart';
import TopLanguages from './components/TopLanguages';
import TopRepos from './components/TopRepos';
import Badge from './components/Badge';
import ShareCard from './components/ShareCard';
import NarrativeSlides from './components/NarrativeSlides';
import { fetchWrappedData, fetchNarrative } from './services/api';

function App() {
  const [showShare, setShowShare] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);
  const [wrappedData, setWrappedData] = useState(null);
  const [narrativeData, setNarrativeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchUsername, setSearchUsername] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingMessages = [
    'Initializing connection...',
    `Scanning @${searchUsername}'s repos...`,
    'Counting commits and contributions...',
    'Analyzing code patterns...',
    'Calculating streak data...',
    'Processing language stats...',
    'Compiling your year in code...',
    'Generating AI narrative...',
    'Crafting your story...'
  ];

  const handleFetchData = async () => {
    if (!searchUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setShowStats(false);
    setLoadingStage(0);
    
    try {
      // Stage 1: Initializing
      setLoadingStage(1);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 2-6: Fetch wrapped data with progressive messages
      setLoadingStage(2);
      const dataPromise = fetchWrappedData(searchUsername, year);
      
      // Animate through stages while fetching
      const stageInterval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < 6) return prev + 1;
          return prev;
        });
      }, 800);
      
      const data = await dataPromise;
      clearInterval(stageInterval);
      
      setWrappedData(data);
      setUsername(searchUsername);
      setLoadingStage(6);
      
      // Stage 7-8: AI narrative generation
      setNarrativeLoading(true);
      setLoadingStage(7);
      
      try {
        const narrative = await fetchNarrative(searchUsername, year);
        setLoadingStage(8);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setNarrativeData(narrative);
        // Auto-show narrative immediately (full-screen experience)
        setShowNarrative(true);
      } catch (narrativeErr) {
        console.error('Failed to generate AI narrative:', narrativeErr);
        // If AI fails, show stats directly
        setShowStats(true);
      } finally {
        setNarrativeLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setWrappedData(null);
    } finally {
      setLoading(false);
      setLoadingStage(0);
    }
  };

  const handleNarrativeClose = () => {
    setShowNarrative(false);
    setShowStats(true);
  };

  // Show landing page if no data loaded yet
  const showLandingPage = !wrappedData && !loading;

  return (
    <div className="min-h-screen relative">
      {/* CRT Overlay */}
      <div className="crt-overlay pointer-events-none"></div>
      <div className="crt-flicker pointer-events-none fixed inset-0 bg-white/5 opacity-[0.02] z-40"></div>

      {/* Landing Page - Clean centered input */}
      {showLandingPage && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {/* Title */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-pixel text-terminal-green mb-4 pixel-text-shadow">
                GITHUB WRAPPED
              </h1>
              <div className="text-3xl md:text-5xl font-pixel text-terminal-amber animate-pulse">
                2025
              </div>
              <p className="mt-6 text-terminal-green/60 font-mono text-sm md:text-base">
                YOUR CODE JOURNEY
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-terminal-black border-4 border-terminal-green p-8 relative">
              <div className="absolute inset-0 pointer-events-none opacity-10"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
                   }}>
              </div>
              
              <div className="relative z-10">
                <div className="font-mono text-terminal-green mb-4 text-left">
                  <span className="text-terminal-amber">&gt;</span> Enter GitHub username
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFetchData()}
                    placeholder="octocat"
                    className="flex-1 bg-terminal-black border-2 border-terminal-green text-terminal-green px-4 py-3 font-mono text-lg focus:outline-none focus:border-terminal-amber"
                    autoFocus
                  />
                  <button
                    onClick={handleFetchData}
                    className="px-8 py-3 bg-terminal-green text-terminal-black font-pixel text-sm hover:bg-terminal-amber transition-colors"
                  >
                    GENERATE
                  </button>
                </div>
                {error && (
                  <div className="text-terminal-red font-mono text-sm mt-3 text-left">
                    ERROR: {error}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-terminal-green/40 font-mono text-xs">
              AI-powered • Retro terminal themed • Built with 💚
            </div>
          </div>
        </div>
      )}

      {/* Loading State - Full screen */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/95 z-40">
          <div className="text-center max-w-2xl w-full px-4">
            <div className="border-4 border-terminal-green p-12 bg-terminal-black relative overflow-hidden">
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
                   }}>
              </div>

              <div className="relative z-10">
                {/* Username */}
                <div className="text-terminal-green font-pixel text-xl mb-2">
                  @{searchUsername}
                </div>
                
                {/* Main loading message */}
                <div className="text-terminal-green font-mono text-2xl md:text-3xl mb-8 h-20 flex items-center justify-center">
                  {loadingMessages[loadingStage] || loadingMessages[0]}
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-terminal-black border-2 border-terminal-green mb-6">
                  <div 
                    className="h-full bg-terminal-green transition-all duration-500"
                    style={{ width: `${(loadingStage / 8) * 100}%` }}
                  ></div>
                </div>

                {/* Animated dots */}
                <div className="flex justify-center gap-3 mb-6">
                  <div className="w-4 h-4 bg-terminal-green animate-pulse"></div>
                  <div className="w-4 h-4 bg-terminal-green animate-pulse delay-100"></div>
                  <div className="w-4 h-4 bg-terminal-green animate-pulse delay-200"></div>
                </div>

                {/* Stage indicator */}
                <div className="text-terminal-green/60 font-mono text-sm">
                  {loadingStage > 0 && `[${loadingStage}/8]`}
                  {loadingStage >= 7 && ' This might take a moment...'}
                </div>

                {/* Terminal-style output */}
                <div className="mt-6 text-left text-terminal-green/40 font-mono text-xs max-h-32 overflow-hidden">
                  {loadingStage >= 1 && <div>&gt; Connecting to GitHub API...</div>}
                  {loadingStage >= 2 && <div>&gt; Repository scan initiated...</div>}
                  {loadingStage >= 3 && <div>&gt; Aggregating commit history...</div>}
                  {loadingStage >= 4 && <div>&gt; Building contribution graph...</div>}
                  {loadingStage >= 5 && <div>&gt; Parsing language distribution...</div>}
                  {loadingStage >= 6 && <div>&gt; Data compilation complete ✓</div>}
                  {loadingStage >= 7 && <div>&gt; Invoking AI narrator...</div>}
                  {loadingStage >= 8 && <div>&gt; Story generation complete ✓</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard - Only show if explicitly requested */}
      {showStats && wrappedData && (
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto relative z-10">
            {/* User Profile Header */}
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
                  onClick={() => { setWrappedData(null); setSearchUsername(''); setShowStats(false); }}
                  className="mt-4 text-terminal-green/60 font-mono text-sm hover:text-terminal-green"
                >
                  [Change User]
                </button>
              </div>
            </div>

            {/* Main Grid */}
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
          </div>
        </div>
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

      {/* AI Narrative Modal */}
      {showNarrative && narrativeData && (
        <NarrativeSlides 
          slides={narrativeData.slides}
          username={username}
          year={year}
          wrappedData={wrappedData}
          onClose={handleNarrativeClose}
        />
      )}
    </div>
  );
}

export default App;
