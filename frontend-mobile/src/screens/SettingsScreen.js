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
  User,
  LogIn,
  LogOut,
  Clock,
  Database,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
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

  const {
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    currentTrialDay,
    trialDaysLeft,
    isTrialExpired,
    resetTrial,
    simulateTrialExpiry,
  } = useAuth();

  const { resetAllProgress } = useProgress();

  const [dailyReminder, setDailyReminder] = useState(true);

  const speedOptions = [
    { label: language === 'mr' ? 'हळू (0.75x)' : 'Slow (0.75x)', val: 0.75 },
    { label: language === 'mr' ? 'सामान्य (0.85x)' : 'Normal (0.85x)', val: 0.85 },
    { label: language === 'mr' ? 'जलद (1.0x)' : 'Fast (1.0x)', val: 1.0 },
  ];

  const handleTestSound = (speed) => {
    Speech.speak('Hello! Welcome to Marathi to English Learning App.', {
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
            await resetAllProgress();
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
            {language === 'mr' ? 'अ‍ॅप सेटिंग्ज व प्रोफाइल' : 'App Settings & Profile'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'mr'
              ? 'वापरकर्ता खाते, भाषा, ऑडिओ उच्चार वेग आणि शिकण्याचा स्तर नियंत्रित करा.'
              : 'Manage user account, app language, pronunciation speed, and learning level.'}
          </Text>
        </View>

        {/* Section 0: User Account & Trial Status */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <User size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'वापरकर्ता खाते (User Account)' : 'User Account'}
            </Text>
          </View>

          {isAuthenticated ? (
            <View style={styles.accountBox}>
              <View style={styles.userRow}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <View style={styles.activeTag}>
                    <Check size={12} color="#065f46" />
                    <Text style={styles.activeTagText}>खाते सक्रिय आहे (Active)</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
                <LogOut size={16} color="#dc2626" />
                <Text style={styles.logoutBtnText}>लॉगआउट करा (Logout)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.guestBox}>
              <View style={styles.guestStatusRow}>
                <Clock size={20} color="#f59e0b" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.guestTitle}>
                    {isTrialExpired ? '⚠️ मोफत ट्रायल संपला आहे' : `🎁 मोफत गेस्ट मोड: दिवस ${currentTrialDay} / 3`}
                  </Text>
                  <Text style={styles.guestSub}>
                    {isTrialExpired
                      ? 'अ‍ॅप सुरू ठेवण्यासाठी त्वरित मोफत खाते बनवा.'
                      : `${trialDaysLeft} दिवस शिल्लक. प्रगती जतन करण्यासाठी मोफत खाते तयार करा.`}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.loginActionBtn} onPress={openAuthModal} activeOpacity={0.85}>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginActionBtnText}>खाते लॉगिन किंवा तयार करा 🚀</Text>
              </TouchableOpacity>

              {/* Trial Debug Simulator Buttons */}
              <View style={styles.debugTrialRow}>
                <TouchableOpacity style={styles.debugTrialBtn} onPress={resetTrial}>
                  <Text style={styles.debugTrialText}>🔄 Reset 3-Day Trial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.debugTrialBtn} onPress={simulateTrialExpiry}>
                  <Text style={styles.debugTrialText}>⏰ Test Expired</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
            <Volume2 size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'उच्चार ऑडिओचा वेग (Speech Speed)' : 'Speech Speed'}
            </Text>
          </View>

          <View style={styles.speedRow}>
            {speedOptions.map(opt => {
              const isSelected = soundSpeed === opt.val;
              return (
                <TouchableOpacity
                  key={opt.val.toString()}
                  style={[styles.speedBtn, isSelected && styles.speedBtnSelected]}
                  onPress={() => {
                    setSoundSpeed(opt.val);
                    handleTestSound(opt.val);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.speedBtnText, isSelected && styles.speedBtnTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.testAudioBtn} onPress={() => handleTestSound()} activeOpacity={0.7}>
            <Volume2 size={16} color={COLORS.secondary} />
            <Text style={styles.testAudioBtnText}>
              {language === 'mr' ? 'उच्चार आवाज तपासा (Test Audio)' : 'Test Sound Sample'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Daily Reminders */}
        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <View style={styles.switchTitleRow}>
                <Bell size={18} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>
                  {language === 'mr' ? 'दैनिक आठवण (Daily Reminder)' : 'Daily Reminder'}
                </Text>
              </View>
              <Text style={styles.switchSub}>
                {language === 'mr'
                  ? 'दररोज रात्री ८:०० वाजता सरावाची आठवण करून द्या.'
                  : 'Get reminded every day at 8:00 PM.'}
              </Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Section 4: Backend Status */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Database size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'सर्व्हर व डेटाबेस स्थिती' : 'Server & Database Status'}
            </Text>
          </View>

          <View style={styles.serverStatusBox}>
            <View style={styles.serverRow}>
              <Text style={styles.serverLabel}>Database:</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineBadgeText}>Neon PostgreSQL (1500+ Words)</Text>
              </View>
            </View>
            <View style={styles.serverRow}>
              <Text style={styles.serverLabel}>Backend API:</Text>
              <Text style={styles.serverValText}>Render Deployed Cloud</Text>
            </View>
          </View>
        </View>

        {/* Section 5: Reset Data */}
        <TouchableOpacity style={styles.resetCard} onPress={handleResetData} activeOpacity={0.8}>
          <RotateCcw size={18} color="#EF4444" />
          <View style={styles.resetTextCol}>
            <Text style={styles.resetTitle}>
              {language === 'mr' ? 'सर्व प्रगती रीसेट करा (Reset Progress)' : 'Reset All Progress'}
            </Text>
            <Text style={styles.resetSub}>
              {language === 'mr' ? 'सर्व धडे आणि गुण पुन्हा सुरुवातीपासून करा' : 'Start from beginning'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* App Info Footer */}
        <View style={styles.footerWrap}>
          <Text style={styles.footerVersion}>English शिका • Version 1.0.0</Text>
          <Text style={styles.footerLove}>Made with ❤️ for Marathi & Hindi learners</Text>
        </View>
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
    padding: SPACING.lg,
    paddingBottom: 60,
  },
  headerCard: {
    marginBottom: SPACING.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
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
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  accountBox: {
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  guestBox: {
    gap: 12,
  },
  guestStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  guestTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
  },
  guestSub: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
  },
  loginActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  loginActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  debugTrialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  debugTrialBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  debugTrialText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  optionsCol: {
    gap: 8,
  },
  optionRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionRowBtnSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionTitleSelected: {
    color: COLORS.primary,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  speedRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  speedBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  speedBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  speedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  speedBtnTextSelected: {
    color: COLORS.white,
  },
  testAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  testAudioBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  switchSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  serverStatusBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  serverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serverLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  serverValText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  resetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 12,
    marginBottom: SPACING.xl,
  },
  resetTextCol: {
    flex: 1,
  },
  resetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  resetSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
  footerWrap: {
    alignItems: 'center',
    gap: 4,
  },
  footerVersion: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  footerLove: {
    fontSize: 11,
    color: COLORS.textLight,
  },
});
