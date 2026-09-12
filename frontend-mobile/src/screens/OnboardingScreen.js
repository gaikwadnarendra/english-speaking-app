import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const OnboardingScreen = () => {
  const { t, language, changeLanguage, completeOnboarding } = useApp();
  const [selectedLevel, setSelectedLevel] = useState(1);

  const levelOptions = [
    {
      id: 1,
      title: t.levelOption1Title,
      desc: t.levelOption1Desc,
      badge: t.levelOption1Badge,
      level: 1
    },
    {
      id: 2,
      title: t.levelOption2Title,
      desc: t.levelOption2Desc,
      badge: t.levelOption2Badge,
      level: 2
    },
    {
      id: 3,
      title: t.levelOption3Title,
      desc: t.levelOption3Desc,
      badge: t.levelOption3Badge,
      level: 3
    },
    {
      id: 4,
      title: t.levelOption4Title,
      desc: t.levelOption4Desc,
      badge: t.levelOption4Badge,
      level: 4
    }
  ];

  const handleFinish = () => {
    completeOnboarding(selectedLevel);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.headerBlock}>
          <View style={styles.logoBadgeBig}>
            <Text style={styles.logoLetterBig}>E</Text>
          </View>
          <Text style={styles.appNameTitle}>{t.appName}</Text>
          <Text style={styles.appSubtitle}>{t.appSubtitle}</Text>

          {/* Motivational Slogan Pill */}
          <View style={styles.sloganPill}>
            <HeartHandshake size={16} color={COLORS.primary} />
            <Text style={styles.sloganText}>"{t.slogan}"</Text>
          </View>
        </View>

        {/* Step 1: Language Picker */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{t.chooseLanguageTitle || 'तुमची भाषा निवडा / अपनी भाषा चुनें:'}</Text>
          <View style={styles.langSelectorRow}>
            {[
              { code: 'mr', label: 'मराठी' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'en', label: 'English' }
            ].map((item) => (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.langOptionBtn,
                  language === item.code && styles.langOptionBtnActive
                ]}
                onPress={() => changeLanguage(item.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    language === item.code && styles.langOptionTextActive
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Level Selection */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{t.currentLevelPrompt}</Text>
          <View style={styles.levelsList}>
            {levelOptions.map((opt) => {
              const isSelected = selectedLevel === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.levelCard, isSelected && styles.levelCardActive]}
                  onPress={() => setSelectedLevel(opt.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <CheckCircle2 size={18} color={COLORS.primary} />}
                  </View>

                  <View style={styles.levelInfo}>
                    <View style={styles.levelTopRow}>
                      <Text style={styles.levelTitleText}>{opt.title}</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{opt.badge.split('—')[0]}</Text>
                      </View>
                    </View>
                    <Text style={styles.levelDescText}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Finish CTA Button */}
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Text style={styles.finishBtnText}>{t.startJourneyBtn}</Text>
          <ArrowRight size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    alignItems: 'center'
  },
  headerBlock: {
    alignItems: 'center',
    marginVertical: SPACING.md,
    gap: 6
  },
  logoBadgeBig: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...SHADOWS.md
  },
  logoLetterBig: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white
  },
  appNameTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center'
  },
  sloganPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    gap: 6
  },
  sloganText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textAlign: 'center'
  },
  sectionBlock: {
    width: '100%',
    marginVertical: SPACING.md
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: SPACING.sm,
    textAlign: 'left'
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  langOptionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  langOptionBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary
  },
  langOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted
  },
  langOptionTextActive: {
    color: COLORS.primaryDark
  },
  levelsList: {
    gap: 10,
    width: '100%'
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 12
  },
  levelCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  radioCircleActive: {
    borderColor: COLORS.primary
  },
  levelInfo: {
    flex: 1,
    gap: 4
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  levelTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
    flex: 1
  },
  levelBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary
  },
  levelDescText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 8,
    ...SHADOWS.lg
  },
  finishBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white
  }
});

export default OnboardingScreen;
