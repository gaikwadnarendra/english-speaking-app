import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

const AudioButton = ({ text, lang = 'en-US', label = '', size = 34, style }) => {
  const { soundSpeed } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!text) return;

    try {
      setIsPlaying(true);
      Speech.stop();
      Speech.speak(text, {
        language: lang,
        rate: soundSpeed || 0.85,
        pitch: 1.0,
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch (err) {
      console.warn('Speech error:', err);
      setIsPlaying(false);
    }
  };

  const btnDiameter = typeof size === 'number' && size >= 28 ? size : 34;
  const iconSize = Math.min(18, Math.round(btnDiameter * 0.5));

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !label && { width: btnDiameter, height: btnDiameter, borderRadius: btnDiameter / 2 },
        isPlaying && styles.buttonActive,
        label ? styles.buttonWithLabel : styles.buttonIconOnly,
        style,
      ]}
      onPress={handleSpeak}
      activeOpacity={0.7}
      accessibilityLabel={`Pronounce ${text}`}
    >
      <Volume2
        size={iconSize}
        color={isPlaying ? COLORS.primaryDark : COLORS.secondary}
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
  },
  buttonIconOnly: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithLabel: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  buttonActive: {
    backgroundColor: COLORS.primaryLight,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  labelActive: {
    color: COLORS.primaryDark,
  },
});

export default AudioButton;

