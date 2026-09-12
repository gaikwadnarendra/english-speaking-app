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
  Sparkles,
  Server,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import { API_BASE_URL } from '../config/api';

export default function SettingsScreen() {
  const {
    t,
    language,
    changeLanguage,
    userLevel,
    setUserLevel,
    soundSpeed,
    setSoundSpeed,
    resetOnboarding,
  } = useApp();

  const [dailyReminder, setDailyReminder] = useState(true);

  const speedOptions = [
    { label: language === 'mr' ? 'हळू (0.75x)' : 'Slow (0.75x)', val: 0.75 },
    { label: language === 'mr' ? 'सामान्य (0.85x)' : 'Normal (0.85x)', val: 0.85 },
    { label: language === 'mr' ? 'जलद (1.0x)' : 'Fast (1.0x)', val: 1.0 },
  ];

  const handleTestSound = (speed) => {
    Speech.speak('Hello! How are you doing today? Welcome to English Shika.', {
      language: 'en-US',
      rate: speed || soundSpeed || 0.85,
    });
  };

  const handleResetData = () => {
    Alert.alert(
      language === 'mr' ? 'सर्व डेटा रीसेट करायचा आहे का?' : 'Reset All App Data?',
      language === 'mr'
        ? 'यामुळे तुमची सर्व धडे, सेव्ह केलेले शब्द आणि प्रगती मिटवली जाईल.'
        : 'This will reset all your completed lessons, favorites, and streak progress.',
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
            <Text style={styles.badgeText}>{language === 'mr' ? 'प्राधान्ये' : 'Preferences'}</Text>
          </View>
          <Text style={styles.headerTitle}>
            {language === 'mr' ? 'अ‍ॅप सेटिंग्ज व ऑडिओ' : 'App Settings & Sound'}
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

          <View style={styles.optionsCol}>
            {[
              { code: 'mr', title: 'मराठी (Marathi)', desc: 'मराठीतून इंग्रजी शिका (Default)' },
              { code: 'hi', title: 'हिंदी (Hindi)', desc: 'हिंदी से अंग्रेजी सीखें' },
              { code: 'en', title: 'English (English)', desc: 'Learn directly in English' },
            ].map(item => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.optionRowBtn, isSelected && styles.optionRowBtnSelected]}
                  onPress={() => changeLanguage(item.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {item.title}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </View>
                  {isSelected && <Check size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Audio Pronunciation Speed */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Volume2 size={18} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'ऑडिओ उच्चार वेग (Voice Speed)' : 'Audio Speed'}
            </Text>
          </View>

          <View style={styles.speedOptionsRow}>
            {speedOptions.map(opt => {
              const isSelected = (soundSpeed || 0.85) === opt.val;
              return (
                <TouchableOpacity
                  key={opt.val}
                  style={[styles.speedBtn, isSelected && styles.speedBtnSelected]}
                  onPress={() => {
                    setSoundSpeed(opt.val);
                    handleTestSound(opt.val);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.speedBtnText, isSelected && styles.speedBtnTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.testSoundBtn}
            onPress={() => handleTestSound(soundSpeed)}
            activeOpacity={0.8}
          >
            <Volume2 size={16} color={COLORS.secondary} />
            <Text style={styles.testSoundBtnText}>
              {language === 'mr' ? 'आवाज तपासा (Test Audio)' : 'Test Pronunciation Voice'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Server & Sync Info */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Server size={18} color={COLORS.accentGreen} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'बॅकएंड सर्व्हर स्थिती' : 'Cloud Server Connection'}
            </Text>
          </View>
          <View style={styles.serverStatusBox}>
            <View style={styles.onlineDot} />
            <Text style={styles.serverStatusText}>
              {language === 'mr' ? 'Render Live Cloud Server जोडलेले आहे' : 'Connected to Render Cloud API'}
            </Text>
          </View>
          <Text style={styles.serverUrlText}>{API_BASE_URL}</Text>
        </View>

        {/* Section 4: Reset Data */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <RotateCcw size={18} color="#EF4444" />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'डेटा व प्रगती रीसेट करा' : 'Reset Progress'}
            </Text>
          </View>
          <Text style={styles.resetWarningText}>
            {language === 'mr'
              ? 'जर तुम्हाला सुरुवातीपासून पुन्हा अभ्यास सुरू करायचा असेल तर तुम्ही स्थानिक डेटा मिटवू शकता.'
              : 'Clear your device learning progress and start fresh from onboarding.'}
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetData}
            activeOpacity={0.8}
          >
            <RotateCcw size={16} color="#EF4444" />
            <Text style={styles.resetBtnText}>
              {language === 'mr' ? 'सर्व प्रगती रीसेट करा' : 'Reset All Progress'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
    gap: 12,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  optionsCol: {
    gap: 8,
  },
  optionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionRowBtnSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  optionTitleSelected: {
    color: COLORS.primaryDark,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  speedOptionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  speedBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  speedBtnSelected: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
  speedBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  speedBtnTextSelected: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
  testSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  testSoundBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  serverStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentGreen,
  },
  serverStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentGreenDark,
  },
  serverUrlText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  resetWarningText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 11,
    borderRadius: RADIUS.sm,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
});
