import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { t, language, changeLanguage, completeOnboarding } = useApp();
  const [selectedLevel, setSelectedLevel] = useState(1);

  const levelOptions = [
    {
      id: 1,
      title: language === 'mr' ? 'अजिबात येत नाही (Zero English)' : 'Absolute Beginner',
      desc: language === 'mr' ? 'इंग्रजी मुळाक्षरे, सोपे शब्द आणि आवाजापासून सुरुवात करा.' : 'Start with phonics, basic alphabet and simple words.',
      badge: language === 'mr' ? 'लेव्हल १' : 'Level 1',
    },
    {
      id: 2,
      title: language === 'mr' ? 'थोडेफार वाचता येते, पण बोलता येत नाही' : 'Can read, but struggle to speak',
      desc: language === 'mr' ? 'दैनंदिन वापरातील शब्द, क्रियापदे आणि उच्चार सुधारा.' : 'Daily vocabulary, verbs (V1-V3) and pronunciation.',
      badge: language === 'mr' ? 'लेव्हल २' : 'Level 2',
    },
    {
      id: 3,
      title: language === 'mr' ? 'इंग्रजी समजते, पण वाक्य बनवता येत नाही' : 'Understand but cannot make sentences',
      desc: language === 'mr' ? 'वाक्यरचना पॅटर्न (I want, I have, I am) आणि रोजची वाक्ये.' : 'Sentence formulas and daily conversation patterns.',
      badge: language === 'mr' ? 'लेव्हल ३' : 'Level 3',
    },
    {
      id: 4,
      title: language === 'mr' ? 'बोलण्याचा सराव हवा आहे (Fluency)' : 'Need Speaking Fluency Practice',
      desc: language === 'mr' ? 'AI संभाषण, थेट बोलण्याचा सराव आणि अचूक उच्चार.' : 'Live conversations, speech drills and accent polishing.',
      badge: language === 'mr' ? 'लेव्हल ४' : 'Level 4',
    },
  ];

  const handleFinish = () => {
    completeOnboarding(selectedLevel);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.headerBlock}>
          <View style={styles.logoBadgeBig}>
            <Text style={styles.logoLetterBig}>E</Text>
          </View>
          <Text style={styles.appNameTitle}>English शिका</Text>
          <Text style={styles.appSubtitle}>
            {language === 'mr' ? 'मराठीतून सोप्या पद्धतीने English शिका' : 'Learn English effortlessly from Marathi & Hindi'}
          </Text>

          {/* Motivational Slogan Pill */}
          <View style={styles.sloganPill}>
            <HeartHandshake size={15} color={COLORS.primary} />
            <Text style={styles.sloganText}>"English शिकण्यासाठी आधी English येणे गरजेचे नाही!"</Text>
          </View>
        </View>

        {/* Step 1: Language Picker */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? '१. तुमची पसंतीची भाषा निवडा:' : '1. Choose your language:'}
          </Text>
          <View style={styles.langSelectorRow}>
            {[
              { code: 'mr', label: 'मराठी' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'en', label: 'English' },
            ].map(item => (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.langOptionBtn,
                  language === item.code && styles.langOptionBtnActive,
                ]}
                onPress={() => changeLanguage(item.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    language === item.code && styles.langOptionTextActive,
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
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? '२. तुमची सध्याची इंग्रजी पातळी कोणती आहे?' : '2. What is your current level?'}
          </Text>
          <View style={styles.levelsList}>
            {levelOptions.map(opt => {
              const isSelected = selectedLevel === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.levelCard, isSelected && styles.levelCardActive]}
                  onPress={() => setSelectedLevel(opt.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <CheckCircle2 size={16} color={COLORS.primary} />}
                  </View>

                  <View style={styles.levelInfo}>
                    <View style={styles.levelTopRow}>
                      <Text style={styles.levelTitleText}>{opt.title}</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{opt.badge}</Text>
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
          <Text style={styles.finishBtnText}>
            {language === 'mr' ? 'शिकायला सुरुवात करा (Start Learning)' : 'Start Learning English'}
          </Text>
          <ArrowRight size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerBlock: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
    gap: 4,
  },
  logoBadgeBig: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...SHADOWS.md,
  },
  logoLetterBig: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
  },
  appNameTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  sloganPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: 6,
    gap: 6,
  },
  sloganText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  sectionBlock: {
    width: '100%',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 8,
    textAlign: 'left',
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  langOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOptionBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  langOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  langOptionTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  levelsList: {
    gap: 8,
    width: '100%',
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 10,
  },
  levelCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  levelInfo: {
    flex: 1,
    gap: 2,
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  levelTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  levelBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  levelDescText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    marginTop: 14,
    gap: 8,
    ...SHADOWS.md,
  },
  finishBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
});
