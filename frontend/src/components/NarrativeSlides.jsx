import React, { useState } from 'react';
import ShareCard from './ShareCard';

const NarrativeSlides = ({ slides, username, year, onClose, wrappedData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!slides || Object.keys(slides).length === 0) {
    return null;
  }

  const slideKeys = [
    'slide_1',
    'slide_2',
    'slide_3',
    'slide_4',
    'slide_5',
    'slide_6',
    'slide_7'
  ];

  const slideTitles = [
    'Welcome to Your Year',
    'Your Activity',
    'Your Rhythm',
    'Your Languages',
    'Your Top Repo',
    'Your Developer Title',
    'Next Year'
  ];

  const totalSlides = slideKeys.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideKey = slideKeys[currentSlide];
  const currentContent = slides[currentSlideKey] || 'Loading...';
  const currentTitle = slideTitles[currentSlide];
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-terminal-green hover:text-white text-2xl font-bold transition-colors z-10"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Main slide container */}
      <div className="max-w-3xl w-full my-8">
        {/* Slide content */}
        <div className="bg-black border-4 border-terminal-green p-8 md:p-12 mb-6 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {/* CRT effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal-green/5 to-transparent pointer-events-none"></div>
          
          {/* Slide number indicator */}
          <div className="absolute top-4 left-4 text-terminal-green/50 font-mono text-sm">
            [{currentSlide + 1}/{totalSlides}]
          </div>

          {/* Slide title */}
          <h2 className="text-terminal-green font-bold text-2xl md:text-3xl mb-6 font-mono">
            {currentTitle}
          </h2>

          {/* Slide content */}
          <div className="text-terminal-green font-mono text-lg md:text-xl leading-relaxed whitespace-pre-line">
            {currentContent}
          </div>

          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
               style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
               }}>
          </div>
        </div>

        {/* Share Card on Last Slide */}
        {isLastSlide && wrappedData && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <h3 className="text-terminal-green font-mono text-xl mb-2">📸 Your Wrapped Card</h3>
              <p className="text-terminal-green/60 font-mono text-sm">Right-click the card below and "Save Image As..." to download</p>
            </div>
            <div className="flex justify-center">
              <ShareCard data={wrappedData} />
            </div>
          </div>
        )}

        {/* Navigation controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-3 font-mono border-2 transition-all ${
              currentSlide === 0
                ? 'border-terminal-green/30 text-terminal-green/30 cursor-not-allowed'
                : 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black'
            }`}
          >
            ← PREV
          </button>

          {/* Progress dots */}
          <div className="flex gap-2">
            {slideKeys.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 border border-terminal-green transition-all ${
                  index === currentSlide
                    ? 'bg-terminal-green'
                    : 'bg-transparent hover:bg-terminal-green/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`px-6 py-3 font-mono border-2 transition-all ${
              currentSlide === totalSlides - 1
                ? 'border-terminal-green/30 text-terminal-green/30 cursor-not-allowed'
                : 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black'
            }`}
          >
            NEXT →
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="text-center text-terminal-green/50 text-sm font-mono">
          Use arrow keys to navigate • ESC to close
        </div>
      </div>
    </div>
  );
};

// Add keyboard navigation
const NarrativeSlidesWithKeyboard = (props) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props]);

  return <NarrativeSlides {...props} />;
};

export default NarrativeSlidesWithKeyboard;
