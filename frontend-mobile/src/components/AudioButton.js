import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

const AudioButton = ({ text, lang = 'en-US', label = '', size = 18, style }) => {
  const { soundSpeed } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!text) return;

    try {
      setIsPlaying(true);
      Speech.stop();
      Speech.speak(text, {
        language: lang,
        rate: soundSpeed || 0.9,
        pitch: 1.0,
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      });
    } catch (err) {
      console.warn('Speech error:', err);
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlaying && styles.buttonActive,
        label ? styles.buttonWithLabel : styles.buttonIconOnly,
        style
      ]}
      onPress={handleSpeak}
      activeOpacity={0.7}
      accessibilityLabel={`Pronounce ${text}`}
    >
      <Volume2
        size={size}
        color={isPlaying ? COLORS.primary : COLORS.secondary}
      />
      {label ? (
        <Text style={[styles.labelText, isPlaying && styles.labelActive]}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.full
  },
  buttonIconOnly: {
    width: 34,
    height: 34
  },
  buttonWithLabel: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    gap: 6
  },
  buttonActive: {
    backgroundColor: COLORS.primaryLight
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary
  },
  labelActive: {
    color: COLORS.primaryDark
  }
});

export default AudioButton;
