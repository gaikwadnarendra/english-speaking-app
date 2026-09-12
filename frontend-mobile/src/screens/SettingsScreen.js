import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Settings,
  Globe,
  Volume2,
  Award,
  Bell,
  RotateCcw,
  Info,
  Check,
  Shield,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';

export default function SettingsScreen() {
  const {
    t,
    language,
    setLanguage,
    userLevel,
    setUserLevel,
    speechRate,
    setSpeechRate,
    resetOnboarding,
  } = useApp();

  const [dailyReminder, setDailyReminder] = useState(true);

  const speedOptions = [
    { label: language === 'mr' ? 'हळू (0.75x)' : 'Slow (0.75x)', val: 0.75 },
    { label: language === 'mr' ? 'सामान्य (0.85x)' : 'Normal (0.85x)', val: 0.85 },
    { label: language === 'mr' ? 'जलद (1.0x)' : 'Fast (1.0x)', val: 1.0 },
  ];

  const handleResetData = () => {
    Alert.alert(
      language === 'mr' ? 'डेटा रीसेट करायचा आहे का?' : 'Reset All App Data?',
      language === 'mr'
        ? 'यामुळे तुमची सर्व धडे, सेव्ह केलेले शब्द आणि प्रगती मिटवली जाईल.'
        : 'This will reset all your completed lessons, favorites and streak progress.',
      [
        { text: language === 'mr' ? 'रद्द करा' : 'Cancel', style: 'cancel' },
        {
          text: language === 'mr' ? 'होय, रीसेट करा' : 'Yes, Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await resetOnboarding();
            Alert.alert(
              language === 'mr' ? 'यशस्वी!' : 'Success!',
              language === 'mr' ? 'सर्व डेटा रीसेट केला गेला आहे.' : 'All app data has been reset.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.headerCard}>
          <View style={styles.badge}>
            <Settings size={14} color={COLORS.primary} />
            <Text style={styles.badgeText}>{language === 'mr' ? 'सेटिंग्ज' : 'Preferences'}</Text>
          </View>
          <Text style={styles.headerTitle}>
            {language === 'mr' ? 'अ‍ॅप सेटिंग्ज व प्राधान्ये' : 'App Settings & Sound'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'mr'
              ? 'भाषा, ऑडिओ उच्चार वेग आणि शिकण्याचा स्तर नियंत्रित करा.'
              : 'Customize app language, pronunciation speed, and learning level.'}
          </Text>
        </View>

        {/* Section 1: Language Switcher */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Globe size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'अ‍ॅपची भाषा (App Language)' : 'App Language'}
            </Text>
          </View>

          <View style={styles.optionsGroup}>
            {[
              { code: 'mr', label: 'मराठी (Marathi)' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'en', label: 'English' },
            ].map(item => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                  onPress={() => setLanguage(item.code)}
                >
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && <Check size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Proficiency Level */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Award size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'माझा इंग्रजी स्तर' : 'English Proficiency Level'}
            </Text>
          </View>

          <View style={styles.optionsGroup}>
            {[
              { id: 'beginner', label: language === 'mr' ? 'नवशिक्या (Beginner - Level 1)' : 'Beginner (Level 1)' },
              { id: 'intermediate', label: language === 'mr' ? 'मध्यम (Intermediate - Level 2-3)' : 'Intermediate (Level 2-3)' },
              { id: 'advanced', label: language === 'mr' ? 'प्रगत (Advanced - Level 4-5)' : 'Advanced (Level 4-5)' },
            ].map(lvl => {
              const isSelected = userLevel === lvl.id;
              return (
                <TouchableOpacity
                  key={lvl.id}
                  style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                  onPress={() => setUserLevel(lvl.id)}
                >
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {lvl.label}
                  </Text>
                  {isSelected && <Check size={18} color={COLORS.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Speech Audio Speed */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Volume2 size={18} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'उच्चार आवाज वेग (Speech Speed)' : 'TTS Pronunciation Speed'}
            </Text>
          </View>

          <View style={styles.speedPillsRow}>
            {speedOptions.map(opt => {
              const isSelected = Math.abs(speechRate - opt.val) < 0.05;
              return (
                <TouchableOpacity
                  key={opt.val}
                  style={[styles.speedPill, isSelected && styles.speedPillActive]}
                  onPress={() => setSpeechRate(opt.val)}
                >
                  <Text style={[styles.speedPillText, isSelected && styles.speedPillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 4: Daily Reminder Toggle */}
        <View style={styles.sectionCard}>
          <View style={styles.toggleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <Bell size={18} color={COLORS.text} />
              <View>
                <Text style={styles.toggleTitle}>
                  {language === 'mr' ? 'दैनंदिन सराव आठवण (Daily Reminder)' : 'Daily Practice Notification'}
                </Text>
                <Text style={styles.toggleSub}>
                  {language === 'mr' ? 'दररोज सकाळी ८:०० वाजता स्मरण' : 'Remind me at 8:00 AM every day'}
                </Text>
              </View>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Section 5: Reset All Data */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetData}
            activeOpacity={0.8}
          >
            <RotateCcw size={18} color="#EF4444" />
            <Text style={styles.resetBtnText}>
              {language === 'mr' ? 'सर्व प्रगती रीसेट करा (Reset Progress)' : 'Reset All Learning Progress'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About App Info */}
        <View style={styles.aboutCard}>
          <Info size={16} color={COLORS.textMuted} />
          <Text style={styles.aboutText}>
            English शिका (Marathi ➔ English Learning App) • v1.0.0 Mobile Expo Build
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  optionsGroup: {
    gap: SPACING.s,
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.m,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  radioItemSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  radioLabelSelected: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  speedPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  speedPill: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  speedPillActive: {
    backgroundColor: COLORS.secondary,
  },
  speedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  speedPillTextActive: {
    color: COLORS.white,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.s,
  },
  aboutText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
