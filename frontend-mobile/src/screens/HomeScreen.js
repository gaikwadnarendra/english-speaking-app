import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  BookOpen,
  Sparkles,
  Award,
  Mic,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Volume2,
  Target,
  Clock,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, language, userLevel, streak, todaySnapshot, refreshTodaySnapshot, isLoading } = useApp();
  const [expandedLevel, setExpandedLevel] = useState(1);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'mr' ? 'शुभ सकाळ! 🌅' : language === 'hi' ? 'सुप्रभात! 🌅' : 'Good Morning! 🌅';
    }
    if (hour < 17) {
      return language === 'mr' ? 'शुभ दुपार! ☀️' : language === 'hi' ? 'शुभ दोपहर! ☀️' : 'Good Afternoon! ☀️';
    }
    return language === 'mr' ? 'शुभ संध्याकाळ! 🌙' : language === 'hi' ? 'शुभ संध्या! 🌙' : 'Good Evening! 🌙';
  };

  const levels = [
    {
      id: 1,
      name: language === 'mr' ? 'लेव्हल १: नवशिक्या (Beginner)' : 'Level 1: Beginner',
      desc: language === 'mr' ? 'इंग्रजी मुळाक्षरे, मूलभूत शब्द आणि सोपे नियम' : 'Alphabet, Phonics & Everyday Basic Words',
      completed: true,
      tasks: 4,
      totalTasks: 4,
      color: COLORS.primary,
    },
    {
      id: 2,
      name: language === 'mr' ? 'लेव्हल २: क्रियापदे (Verbs & Tenses)' : 'Level 2: Verbs & Tenses',
      desc: language === 'mr' ? '३००+ महत्त्वाची क्रियापदे (V1, V2, V3) व काळ' : 'Essential Verbs & Simple Tense Rules',
      completed: false,
      tasks: 3,
      totalTasks: 5,
      color: COLORS.secondary,
    },
    {
      id: 3,
      name: language === 'mr' ? 'लेव्हल ३: वाक्य रचना (Sentence Patterns)' : 'Level 3: Sentence Patterns',
      desc: language === 'mr' ? 'I want, I have, Can you वाक्यरचना सराव' : 'Daily sentence templates & speaking structures',
      completed: false,
      tasks: 1,
      totalTasks: 6,
      color: COLORS.accentGreen,
    },
    {
      id: 4,
      name: language === 'mr' ? 'लेव्हल ४: दैनंदिन संभाषण (Daily Dialogues)' : 'Level 4: Dialogues',
      desc: language === 'mr' ? 'दुकान, हॉटेल, प्रवास आणि ऑफिसमधील इंग्रजी' : 'Real life conversations & situations',
      completed: false,
      tasks: 0,
      totalTasks: 5,
      color: COLORS.accentPurple,
    },
    {
      id: 5,
      name: language === 'mr' ? 'लेव्हल ५: अस्खलित इंग्रजी (Fluency Master)' : 'Level 5: Fluency',
      desc: language === 'mr' ? 'आत्मविश्वासाने आणि अडखळता इंग्रजी बोला' : 'Spontaneous English & AI debate practice',
      completed: false,
      tasks: 0,
      totalTasks: 6,
      color: COLORS.accentAmber,
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(isLoading)}
            onRefresh={refreshTodaySnapshot}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Hero Welcome Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.dailyMissionPill}>
              <Target size={13} color={COLORS.primaryDark} />
              <Text style={styles.dailyMissionText}>
                {language === 'mr' ? 'आजचे ध्येय' : language === 'hi' ? 'आज का लक्ष्य' : 'Daily Mission'}
              </Text>
            </View>
            <View style={styles.streakTag}>
              <Flame size={14} color={COLORS.primary} fill={COLORS.primary} />
              <Text style={styles.streakTagText}>{streak} {language === 'mr' ? 'दिवस सातत्य' : 'Days Streak'}</Text>
            </View>
          </View>

          <Text style={styles.heroGreetingText}>{getGreeting()}</Text>
          <Text style={styles.heroSubtext}>
            {language === 'mr'
              ? 'दररोज ५ मिनिटे सराव करा आणि सोप्या पद्धतीने अस्खलित इंग्रजी बोलायला शिका.'
              : language === 'hi'
              ? 'रोज 5 मिनट अभ्यास करें और आसान तरीके से फर्राटेदार अंग्रेजी सीखें।'
              : 'Practice 5 minutes daily and master fluent English speaking step-by-step.'}
          </Text>

          {/* Action Button Row */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Daily')}
            >
              <Text style={styles.heroPrimaryBtnText}>
                {language === 'mr' ? 'आजचा सराव सुरू करा' : 'Start Today\'s Lesson'}
              </Text>
              <ArrowRight size={18} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Speaking')}
            >
              <Mic size={17} color={COLORS.secondary} />
              <Text style={styles.heroSecondaryBtnText}>
                {language === 'mr' ? 'Speaking AI' : 'Speaking'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Stat Highlights in 2x2 Grid */}
        <View style={styles.statsGrid}>
          {/* Words Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.primaryLight }]}>
                <BookOpen size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>45</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'एकूण शब्द (Words)' : 'Total Words'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '45%', backgroundColor: COLORS.primary }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'ध्येय: ५०० शब्द' : 'Goal: 500 Words'}</Text>
          </View>

          {/* Speaking Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.secondary }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.secondaryLight }]}>
                <Mic size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>12</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'संभाषणे (Speaking)' : 'Speaking'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '40%', backgroundColor: COLORS.secondary }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'ध्येय: ३० संभाषणे' : 'Goal: 30 Sessions'}</Text>
          </View>

          {/* Accuracy Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.accentGreen }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentGreenLight }]}>
                <Award size={16} color={COLORS.accentGreen} />
              </View>
              <Text style={styles.statValue}>88%</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'अचूकता (Accuracy)' : 'Accuracy'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '88%', backgroundColor: COLORS.accentGreen }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'क्विझ अचूकता' : 'Quiz Accuracy'}</Text>
          </View>

          {/* Lessons Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.accentPurple }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentPurpleLight }]}>
                <Target size={16} color={COLORS.accentPurple} />
              </View>
              <Text style={styles.statValue}>5</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'पूर्ण धडे (Lessons)' : 'Lessons'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '25%', backgroundColor: COLORS.accentPurple }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'ध्येय: ५० धडे' : 'Goal: 50 Lessons'}</Text>
          </View>
        </View>

        {/* Quick Modules Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? 'अभ्यास विभाग (Learning Modules)' : 'Learning Modules'}
          </Text>
        </View>

        <View style={styles.modulesGrid}>
          <TouchableOpacity
            style={[styles.moduleCard, { borderLeftColor: COLORS.primary }]}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.7}
          >
            <View style={[styles.moduleIconBadge, { backgroundColor: COLORS.primaryLight }]}>
              <BookOpen size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.moduleTitle}>{language === 'mr' ? 'धडे व व्याकरण' : 'Lessons'}</Text>
            <Text style={styles.moduleSub}>{language === 'mr' ? 'स्टेप बाय स्टेप शिका' : 'Step-by-step'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moduleCard, { borderLeftColor: COLORS.secondary }]}
            onPress={() => navigation.navigate('Vocab')}
            activeOpacity={0.7}
          >
            <View style={[styles.moduleIconBadge, { backgroundColor: COLORS.secondaryLight }]}>
              <Sparkles size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.moduleTitle}>{language === 'mr' ? 'शब्दसंग्रह (Vocab)' : 'Vocabulary'}</Text>
            <Text style={styles.moduleSub}>{language === 'mr' ? '५००+ रोजचे शब्द' : '500+ Daily Words'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moduleCard, { borderLeftColor: COLORS.accentGreen }]}
            onPress={() => navigation.navigate('Practice')}
            activeOpacity={0.7}
          >
            <View style={[styles.moduleIconBadge, { backgroundColor: COLORS.accentGreenLight }]}>
              <Award size={20} color={COLORS.accentGreen} />
            </View>
            <Text style={styles.moduleTitle}>{language === 'mr' ? 'सराव क्विझ' : 'Quiz & Practice'}</Text>
            <Text style={styles.moduleSub}>{language === 'mr' ? 'जोड्या व प्रश्न' : 'MCQ & Match'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moduleCard, { borderLeftColor: COLORS.accentAmber }]}
            onPress={() => navigation.navigate('Speaking')}
            activeOpacity={0.7}
          >
            <View style={[styles.moduleIconBadge, { backgroundColor: COLORS.accentAmberLight }]}>
              <Mic size={20} color={COLORS.accentAmberDark} />
            </View>
            <Text style={styles.moduleTitle}>{language === 'mr' ? 'थेट संभाषण' : 'Speaking AI'}</Text>
            <Text style={styles.moduleSub}>{language === 'mr' ? 'AI सोबत बोला' : 'Voice AI Chat'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Learning Snapshot */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? "आजचा अभ्यास (Today's Snapshot)" : "Today's Learning"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {language === 'mr' ? 'आजचे निवडक शब्द ऐका व सराव करा' : 'Listen & practice today\'s curated words'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Vocab')} activeOpacity={0.7}>
            <Text style={styles.sectionLinkText}>{language === 'mr' ? 'सर्व शब्द →' : 'View All →'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wordsList}>
          {(todaySnapshot?.words || [
            { id: 1, word: 'Water', marathi: 'पाणी', hindi: 'पानी', pronunciation: 'वॉटर', type: 'noun' },
            { id: 2, word: 'Book', marathi: 'पुस्तक', hindi: 'किताब', pronunciation: 'बुक', type: 'noun' },
            { id: 3, word: 'Speak', marathi: 'बोलणे', hindi: 'बोलना', pronunciation: 'स्पीक', type: 'verb' },
          ]).slice(0, 3).map((item, idx) => (
            <View key={item.id || idx} style={styles.wordItemCard}>
              <View style={styles.wordNumCircle}>
                <Text style={styles.wordNumText}>{idx + 1}</Text>
              </View>
              <View style={styles.wordInfoCol}>
                <View style={styles.wordHeaderRow}>
                  <Text style={styles.wordEnText}>{item.word}</Text>
                  {item.type && (
                    <View style={styles.wordTypePill}>
                      <Text style={styles.wordTypePillText}>{item.type}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.wordMeaningText}>
                  {language === 'mr' ? item.marathi : language === 'hi' ? item.hindi : item.marathi}
                  {item.pronunciation ? ` • (${item.pronunciation})` : ''}
                </Text>
              </View>
              <AudioButton text={item.word} size={38} />
            </View>
          ))}
        </View>

        {/* Learning Journey Roadmap */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>🗺️ {language === 'mr' ? 'इंग्रजी शिकण्याचा मार्ग' : 'Your Learning Journey'}</Text>
            <Text style={styles.sectionSubtitle}>
              {language === 'mr' ? 'एक एक लेव्हल पूर्ण करून पुढील लेव्हल अनलॉक करा' : 'Complete levels to unlock next'}
            </Text>
          </View>
        </View>

        <View style={styles.journeyList}>
          {levels.map((lvl) => {
            const isExpanded = expandedLevel === lvl.id;
            return (
              <TouchableOpacity
                key={lvl.id}
                style={[
                  styles.journeyCard,
                  { borderLeftColor: lvl.completed ? COLORS.accentGreen : lvl.color },
                ]}
                onPress={() => setExpandedLevel(isExpanded ? null : lvl.id)}
                activeOpacity={0.8}
              >
                <View style={styles.journeyHeaderRow}>
                  <View style={[styles.journeyLevelBadge, { backgroundColor: lvl.completed ? COLORS.accentGreenLight : `${lvl.color}20` }]}>
                    {lvl.completed ? (
                      <CheckCircle2 size={16} color={COLORS.accentGreen} />
                    ) : (
                      <Text style={[styles.journeyLevelBadgeText, { color: lvl.color }]}>L{lvl.id}</Text>
                    )}
                  </View>
                  <View style={styles.journeyTitleCol}>
                    <Text style={styles.journeyTitle}>{lvl.name}</Text>
                    <Text style={styles.journeyDesc}>{lvl.desc}</Text>
                  </View>
                  <ChevronRight
                    size={18}
                    color={COLORS.textMuted}
                    style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                  />
                </View>

                {/* Progress bar */}
                <View style={styles.journeyProgressRow}>
                  <View style={styles.journeyProgressBarBg}>
                    <View
                      style={[
                        styles.journeyProgressBarFill,
                        {
                          width: `${(lvl.tasks / lvl.totalTasks) * 100}%`,
                          backgroundColor: lvl.completed ? COLORS.accentGreen : lvl.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.journeyProgressText}>
                    {lvl.tasks}/{lvl.totalTasks} {language === 'mr' ? 'भाग पूर्ण' : 'completed'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: 120, // ample bottom padding so it never hides under bottom navigation
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dailyMissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
  },
  dailyMissionText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.streakBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.streakBorder,
  },
  streakTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  heroGreetingText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  heroSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  heroPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  heroSecondaryBtn: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  heroSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 6,
  },
  statProgressBarBg: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  statProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  statSubtext: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  sectionLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: SPACING.md,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  moduleIconBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  moduleSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  wordsList: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  wordItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: 10,
  },
  wordNumCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  wordInfoCol: {
    flex: 1,
  },
  wordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  wordEnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  wordTypePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  wordTypePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  wordMeaningText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  journeyList: {
    gap: 10,
    marginBottom: SPACING.md,
  },
  journeyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  journeyLevelBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyLevelBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  journeyTitleCol: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  journeyDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  journeyProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  journeyProgressBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  journeyProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  journeyProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});
