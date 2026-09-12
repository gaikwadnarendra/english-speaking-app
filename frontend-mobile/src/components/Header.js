import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Flame, Globe, Settings, Heart, TrendingUp } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const Header = () => {
  const navigation = useNavigation();
  const { t, language, changeLanguage, streak, userLevel } = useApp();

  const cycleLanguage = () => {
    if (language === 'mr') changeLanguage('hi');
    else if (language === 'hi') changeLanguage('en');
    else changeLanguage('mr');
  };

  const getLangLabel = () => {
    if (language === 'mr') return 'मराठी';
    if (language === 'hi') return 'हिंदी';
    return 'ENG';
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.brandRow}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>E</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>{t('appName')}</Text>
          <Text style={styles.brandBadgeText}>English शिका</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        {/* Streak Counter Pill */}
        <TouchableOpacity
          style={styles.streakPill}
          onPress={() => navigation.navigate('Progress')}
          activeOpacity={0.8}
        >
          <Flame size={14} color={COLORS.streak} />
          <Text style={styles.streakNumber}>{streak}</Text>
        </TouchableOpacity>

        {/* Favorites Quick Button */}
        <TouchableOpacity
          style={styles.iconActionBtn}
          onPress={() => navigation.navigate('Favorites')}
          activeOpacity={0.7}
        >
          <Heart size={16} color="#EF4444" fill="#EF4444" />
        </TouchableOpacity>

        {/* Language Switcher */}
        <TouchableOpacity
          style={styles.langPill}
          onPress={cycleLanguage}
          activeOpacity={0.7}
        >
          <Globe size={13} color={COLORS.primary} />
          <Text style={styles.langText}>{getLangLabel()}</Text>
        </TouchableOpacity>

        {/* Settings Quick Button */}
        <TouchableOpacity
          style={styles.iconActionBtn}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Settings size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  streakNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#F3F4F6',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default Header;
