// Audio and Text-to-Speech Engine with fallback support (Spec v2.0 Section 12)

export const speakText = (text, lang = 'en-US', rate = 0.9, onEnd = null) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis API is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Find optimal voice for language
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (lang.startsWith('en')) {
    selectedVoice = voices.find(v => v.lang === 'en-IN') ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    null;
  } else if (lang.startsWith('mr')) {
    selectedVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('mar')) ||
                    voices.find(v => v.lang.includes('hi')) ||
                    null;
  } else if (lang.startsWith('hi')) {
    selectedVoice = voices.find(v => v.lang.includes('hi')) || null;
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.lang = lang;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const checkSpeechSupport = () => {
  const hasTTS = 'speechSynthesis' in window;
  const hasSTT = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const hasMediaRecorder = 'MediaRecorder' in window;
  return { hasTTS, hasSTT, hasMediaRecorder };
};
