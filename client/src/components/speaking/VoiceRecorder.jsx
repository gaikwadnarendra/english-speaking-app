import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Volume2, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { speakText } from '../../utils/ttsHelper';
import { useApp } from '../../context/AppContext';

const VoiceRecorder = ({ targetSentence, targetPronunciation, targetMarathi, targetHindi, onComplete }) => {
  const { soundSpeed, t, language } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [selfRating, setSelfRating] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        calculateMatchScore(transcript, targetSentence);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition status:', e.error);
      };

      recognitionRef.current = recognition;
    }
  }, [targetSentence]);

  // Clean Levenshtein / Similarity Match
  const calculateMatchScore = (spoken, target) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    if (cleanSpoken === cleanTarget) {
      setMatchScore(100);
      return;
    }

    const spokenWords = cleanSpoken.split(' ');
    const targetWords = cleanTarget.split(' ');
    let matches = 0;
    spokenWords.forEach(w => {
      if (targetWords.includes(w)) matches++;
    });

    const score = Math.min(100, Math.round((matches / targetWords.length) * 100));
    setMatchScore(Math.max(score, 50));
  };

  const startRecording = async () => {
    setAudioUrl(null);
    setRecognizedText('');
    setMatchScore(null);
    setSelfRating(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Also trigger speech recognition if available
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch (err) {
      alert(t.micPermissionAlert);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const playMyVoice = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlayingRecording(true);
      audio.onended = () => setIsPlayingRecording(false);
      audio.play();
    }
  };

  const playModelVoice = () => {
    speakText(targetSentence, 'en-US', soundSpeed);
  };

  const handleRate = (rating) => {
    setSelfRating(rating);
    if (onComplete) onComplete(rating);
  };

  return (
    <div className="voice-recorder-card glass-card">
      <div className="target-prompt-header">
        <span className="badge badge-indigo">{t.listenRepeatTab}</span>
        <h2 className="target-sentence-text">"{targetSentence}"</h2>
        <div className="target-meta-row">
          <span className="phonetic-guide">{t.pronunciationLabel}: {targetPronunciation}</span>
          <span className="marathi-meaning">
            {language === 'hi' ? 'हिंदी अर्थ' : language === 'en' ? 'Meaning' : 'मराठी अर्थ'}: {language === 'hi' && targetHindi ? targetHindi : targetMarathi}
          </span>
        </div>
      </div>

      {/* Model Audio Listen Button */}
      <div className="listen-model-box">
        <button className="btn-secondary" onClick={playModelVoice}>
          <Volume2 size={20} />
          <span>{t.listenModelVoice}</span>
        </button>
      </div>

      {/* Main Record Control */}
      <div className="record-actions-area">
        {!isRecording ? (
          <button className="record-big-button start" onClick={startRecording}>
            <Mic size={28} />
            <span>{t.tapToStartSpeaking}</span>
          </button>
        ) : (
          <button className="record-big-button recording" onClick={stopRecording}>
            <Square size={26} />
            <span>{t.stopRecordingBtn}</span>
          </button>
        )}
      </div>

      {/* Offline Side-by-Side Audio Comparison & Recognition Result */}
      {audioUrl && (
        <div className="feedback-comparison-box">
          <h4 className="feedback-title">{t.recordingReady}</h4>

          <div className="audio-comparison-buttons">
            <button
              className={`compare-btn ${isPlayingRecording ? 'playing' : ''}`}
              onClick={playMyVoice}
            >
              <Play size={18} />
              <span>{t.listenToYou}</span>
            </button>
            <button className="compare-btn model" onClick={playModelVoice}>
              <Volume2 size={18} />
              <span>{t.modelVoiceLabel}</span>
            </button>
          </div>

          {recognizedText && (
            <div className="speech-result-pill">
              <span className="recognized-label">{t.recognizedWordsLabel}</span>
              <span className="recognized-words">"{recognizedText}"</span>
              {matchScore !== null && (
                <span className={`score-badge ${matchScore >= 80 ? 'good' : 'average'}`}>
                  {matchScore}% {t.accuracyLabel}
                </span>
              )}
            </div>
          )}

          {/* Self-Rating Star Option */}
          <div className="self-rate-section">
            <p className="rate-title">{t.howWasPronunciation}</p>
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${selfRating && selfRating >= star ? 'filled' : ''}`}
                  onClick={() => handleRate(star)}
                >
                  <Star size={24} />
                </button>
              ))}
            </div>
            {selfRating && (
              <p className="rating-feedback-msg">
                {selfRating >= 4 ? t.rateExcellent : t.rateGoodTry}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .voice-recorder-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          border: 1px solid var(--border-color);
        }
        .target-prompt-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .target-sentence-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .target-meta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .phonetic-guide {
          color: var(--primary);
          font-weight: 700;
        }
        .marathi-meaning {
          color: #334155;
          font-weight: 600;
        }
        .record-actions-area {
          margin: 8px 0;
        }
        .record-big-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.1rem;
          color: #ffffff;
          transition: all 0.2s ease;
        }
        .record-big-button.start {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);
        }
        .record-big-button.start:hover {
          transform: scale(1.04);
          box-shadow: 0 10px 28px rgba(249, 115, 22, 0.45);
        }
        .record-big-button.recording {
          background: #ef4444;
          box-shadow: 0 0 24px rgba(239, 68, 68, 0.6);
          animation: pulseRed 1.5s infinite;
        }
        @keyframes pulseRed {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .feedback-comparison-box {
          width: 100%;
          max-width: 540px;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feedback-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .audio-comparison-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .compare-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 700;
          background: var(--primary-light);
          color: var(--primary-dark);
        }
        .compare-btn.model {
          background: var(--secondary-light);
          color: var(--secondary);
        }
        .speech-result-pill {
          background: #ffffff;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 0.9rem;
        }
        .recognized-label {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .recognized-words {
          font-weight: 700;
          color: #0f172a;
        }
        .score-badge {
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.8rem;
        }
        .score-badge.good {
          background: #d1fae5;
          color: #065f46;
        }
        .score-badge.average {
          background: #fef3c7;
          color: #92400e;
        }
        .self-rate-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .rate-title {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stars-row {
          display: flex;
          gap: 8px;
        }
        .star-btn {
          color: #cbd5e1;
          padding: 4px;
        }
        .star-btn.filled {
          color: #f59e0b;
          fill: #f59e0b;
        }
        .rating-feedback-msg {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;
