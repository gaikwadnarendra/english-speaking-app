import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Globe, Settings, Heart, User } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, language, changeLanguage, streak } = useApp();
  const { user, isAuthenticated, openAuthModal } = useAuth();

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
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top + 6, 12) }]}>
      <TouchableOpacity
        style={styles.brandRow}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>E</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>English शिका</Text>
          <Text style={styles.brandBadgeText}>Marathi to English</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        {/* Streak Counter Pill */}
        <TouchableOpacity
          style={styles.streakPill}
          onPress={() => navigation.navigate('Progress')}
          activeOpacity={0.8}
        >
          <Flame size={15} color={COLORS.primary} fill={COLORS.primary} />
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
          <Globe size={13} color={COLORS.secondary} />
          <Text style={styles.langText}>{getLangLabel()}</Text>
        </TouchableOpacity>

        {/* User Account / Login Button */}
        <TouchableOpacity
          style={styles.iconActionBtn}
          onPress={openAuthModal}
          activeOpacity={0.7}
        >
          {isAuthenticated ? (
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
            </View>
          ) : (
            <User size={16} color={COLORS.secondary} />
          )}
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
    paddingHorizontal: SPACING.md,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  logoLetter: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
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
    gap: 4,
    backgroundColor: COLORS.streakBg,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.streakBorder,
  },
  streakNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  iconActionBtn: {
    padding: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  headerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
});

export default Header;

