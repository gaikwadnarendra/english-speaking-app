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
  Circle,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import TrialBanner from '../components/TrialBanner';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, language, streak, todaySnapshot, refreshTodaySnapshot, isLoading } = useApp();
  const { LEVELS, isLevelComplete, isLevelUnlocked, isTaskCompleted, completeTask, currentLevel } = useProgress();
  const { user } = useAuth();
  const [expandedLevel, setExpandedLevel] = useState(currentLevel || 1);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const namePrefix = user?.name ? `${user.name}, ` : '';
    if (hour < 12) {
      return language === 'mr' ? `शुभ सकाळ! 🌅 ${namePrefix}` : language === 'hi' ? `सुप्रभात! 🌅 ${namePrefix}` : `Good Morning! 🌅 ${namePrefix}`;
    }
    if (hour < 17) {
      return language === 'mr' ? `शुभ दुपार! ☀️ ${namePrefix}` : language === 'hi' ? `शुभ दोपहर! ☀️ ${namePrefix}` : `Good Afternoon! ☀️ ${namePrefix}`;
    }
    return language === 'mr' ? `शुभ संध्याकाळ! 🌙 ${namePrefix}` : language === 'hi' ? `शुभ संध्या! 🌙 ${namePrefix}` : `Good Evening! 🌙 ${namePrefix}`;
  };

  return (
    <View style={styles.container}>
      <Header />
      <TrialBanner />

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
              <Text style={styles.statValue}>1500+</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'एकूण शब्द (Words)' : 'Total Words'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '75%', backgroundColor: COLORS.primary }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'Neon DB वरून सक्रिय' : 'Active from Database'}</Text>
          </View>

          {/* Speaking Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.secondary }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.secondaryLight }]}>
                <Mic size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>6 Scenarios</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'संभाषणे (Speaking)' : 'Speaking'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '60%', backgroundColor: COLORS.secondary }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'AI संभाषण उपलब्ध' : 'AI Voice Partner'}</Text>
          </View>

          {/* Accuracy Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.accentGreen }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentGreenLight }]}>
                <Award size={16} color={COLORS.accentGreen} />
              </View>
              <Text style={styles.statValue}>92%</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'अचूकता (Accuracy)' : 'Accuracy'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '92%', backgroundColor: COLORS.accentGreen }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'क्विझ अचूकता' : 'Quiz Accuracy'}</Text>
          </View>

          {/* Lessons Stat */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.accentPurple }]}>
            <View style={styles.statTopRow}>
              <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentPurpleLight }]}>
                <Target size={16} color={COLORS.accentPurple} />
              </View>
              <Text style={styles.statValue}>20</Text>
            </View>
            <Text style={styles.statLabel}>{language === 'mr' ? 'धडे (Lessons)' : 'Lessons'}</Text>
            <View style={styles.statProgressBarBg}>
              <View style={[styles.statProgressBarFill, { width: '50%', backgroundColor: COLORS.accentPurple }]} />
            </View>
            <Text style={styles.statSubtext}>{language === 'mr' ? 'लेव्हल १ ते ५' : 'Levels 1 to 5'}</Text>
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
            <Text style={styles.moduleSub}>{language === 'mr' ? '१५००+ रोजचे शब्द' : '1500+ Daily Words'}</Text>
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

        {/* Learning Journey Roadmap with Real Level Tasks */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>🗺️ {language === 'mr' ? 'इंग्रजी शिकण्याचा मार्ग (Level Progression)' : 'Your Learning Journey'}</Text>
            <Text style={styles.sectionSubtitle}>
              {language === 'mr' ? 'प्रत्येक लेव्हलचे टास्क पूर्ण करून पुढील लेव्हल अनलॉक करा' : 'Complete tasks to unlock each level'}
            </Text>
          </View>
        </View>

        <View style={styles.journeyList}>
          {LEVELS.map((lvl) => {
            const isExpanded = expandedLevel === lvl.id;
            const completed = isLevelComplete(lvl.id);
            const unlocked = isLevelUnlocked(lvl.id);
            const doneTasks = lvl.tasks.filter(t => isTaskCompleted(lvl.id, t.key)).length;

            return (
              <View
                key={lvl.id}
                style={[
                  styles.journeyCard,
                  { borderLeftColor: completed ? COLORS.accentGreen : (unlocked ? lvl.color : '#cbd5e1') },
                  !unlocked && styles.journeyCardLocked
                ]}
              >
                <TouchableOpacity
                  style={styles.journeyHeaderRow}
                  onPress={() => {
                    if (unlocked) setExpandedLevel(isExpanded ? null : lvl.id);
                  }}
                  activeOpacity={unlocked ? 0.7 : 1}
                >
                  <View style={[
                    styles.journeyLevelBadge,
                    { backgroundColor: completed ? COLORS.accentGreenLight : (unlocked ? `${lvl.color}20` : '#f1f5f9') }
                  ]}>
                    {completed ? (
                      <CheckCircle2 size={16} color={COLORS.accentGreen} />
                    ) : !unlocked ? (
                      <Lock size={14} color="#94a3b8" />
                    ) : (
                      <Text style={[styles.journeyLevelBadgeText, { color: lvl.color }]}>L{lvl.id}</Text>
                    )}
                  </View>

                  <View style={styles.journeyTitleCol}>
                    <Text style={[styles.journeyTitle, !unlocked && styles.journeyTitleLocked]}>
                      {language === 'mr' ? lvl.nameMr : lvl.name}
                    </Text>
                    <Text style={styles.journeyDesc}>
                      {doneTasks}/{lvl.tasks.length} {language === 'mr' ? 'टास्क पूर्ण' : 'tasks done'}
                    </Text>
                  </View>

                  {unlocked && (
                    <ChevronRight
                      size={18}
                      color={COLORS.textMuted}
                      style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                    />
                  )}
                </TouchableOpacity>

                {/* Progress bar */}
                <View style={styles.journeyProgressRow}>
                  <View style={styles.journeyProgressBarBg}>
                    <View
                      style={[
                        styles.journeyProgressBarFill,
                        {
                          width: `${(doneTasks / lvl.tasks.length) * 100}%`,
                          backgroundColor: completed ? COLORS.accentGreen : (unlocked ? lvl.color : '#cbd5e1'),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.journeyProgressText}>
                    {doneTasks}/{lvl.tasks.length}
                  </Text>
                </View>

                {/* Expanded Tasks List */}
                {isExpanded && unlocked && (
                  <View style={styles.tasksBox}>
                    {lvl.tasks.map((task) => {
                      const isDone = isTaskCompleted(lvl.id, task.key);
                      return (
                        <TouchableOpacity
                          key={task.key}
                          style={styles.taskItemRow}
                          onPress={() => {
                            if (task.screen) navigation.navigate(task.screen);
                          }}
                          activeOpacity={0.7}
                        >
                          <TouchableOpacity
                            onPress={() => completeTask(lvl.id, task.key)}
                            style={styles.checkWrap}
                          >
                            {isDone ? (
                              <CheckCircle2 size={18} color="#10b981" />
                            ) : (
                              <Circle size={18} color="#94a3b8" />
                            )}
                          </TouchableOpacity>
                          <Text style={[styles.taskItemText, isDone && styles.taskItemTextDone]}>
                            {language === 'mr' ? task.labelMr : task.label}
                          </Text>
                          <ChevronRight size={14} color="#94a3b8" />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
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
    paddingBottom: 120,
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
    marginBottom: 16,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    ...SHADOWS.button,
  },
  heroPrimaryBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  heroSecondaryBtnText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  statProgressBarBg: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  statProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  statSubtext: {
    fontSize: 9,
    color: COLORS.textLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.md,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  moduleIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  moduleSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
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
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    ...SHADOWS.card,
  },
  wordNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  wordInfoCol: {
    flex: 1,
  },
  wordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordEnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  wordTypePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
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
    marginTop: 2,
  },
  journeyList: {
    gap: 10,
    marginBottom: SPACING.md,
  },
  journeyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  journeyCardLocked: {
    opacity: 0.65,
    backgroundColor: '#f8fafc',
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  journeyLevelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeyLevelBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  journeyTitleCol: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  journeyTitleLocked: {
    color: '#94a3b8',
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
    marginTop: 10,
  },
  journeyProgressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  journeyProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  journeyProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tasksBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkWrap: {
    padding: 2,
  },
  taskItemText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  taskItemTextDone: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  }
});
