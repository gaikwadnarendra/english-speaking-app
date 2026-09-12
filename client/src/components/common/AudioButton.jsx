import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '../../utils/ttsHelper';
import { useApp } from '../../context/AppContext';

const AudioButton = ({ text, lang = 'en-US', size = 18, label = '', className = '' }) => {
  const { soundSpeed } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    speakText(text, lang, soundSpeed, () => {
      setIsPlaying(false);
    });
  };

  return (
    <button
      className={`audio-btn-component ${isPlaying ? 'playing' : ''} ${className}`}
      onClick={handlePlay}
      title={`Listen to "${text}"`}
      aria-label={`Listen to "${text}"`}
    >
      {isPlaying ? (
        <div className="audio-wave-bars">
          <span className="audio-wave-bar" />
          <span className="audio-wave-bar" />
          <span className="audio-wave-bar" />
        </div>
      ) : (
        <Volume2 size={size} />
      )}
      {label && <span className="audio-btn-label">{label}</span>}

      <style>{`
        .audio-btn-component {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: var(--radius-full);
          background: var(--primary-light);
          color: var(--primary-dark);
          font-weight: 600;
          font-size: 0.82rem;
          transition: all 0.2s ease;
        }
        .audio-btn-component:hover {
          background: #fed7aa;
          transform: scale(1.04);
        }
        .audio-btn-component.playing {
          background: var(--primary);
          color: #ffffff;
        }
        .audio-wave-bars {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 16px;
        }
        .audio-wave-bars .audio-wave-bar {
          background: currentColor;
        }
      `}</style>
    </button>
  );
};

export default AudioButton;
