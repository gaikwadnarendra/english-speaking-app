import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Target,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  Trophy,
  BookOpen,
  Sparkles,
  Award,
  Mic,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';

const DAILY_TASKS_KEY = '@english_shika_daily_tasks';

export default function DailyScreen() {
  const navigation = useNavigation();
  const { t, language, streak } = useApp();

  const [tasks, setTasks] = useState([
    {
      id: 'task1',
      title_mr: '५ नवीन शब्द शिका (Vocabulary)',
      title_hi: '५ नए शब्द सीखें (Vocabulary)',
      title_en: 'Learn 5 New Words',
      screen: 'Vocab',
      icon: Sparkles,
      color: COLORS.secondary,
      completed: true,
      xp: 15,
    },
    {
      id: 'task2',
      title_mr: '१ व्याकरण धडा पूर्ण करा (Grammar Lesson)',
      title_hi: '१ व्याकरण पाठ पूरा करें',
      title_en: 'Complete 1 Grammar Lesson',
      screen: 'Learn',
      icon: BookOpen,
      color: COLORS.primary,
      completed: true,
      xp: 25,
    },
    {
      id: 'task3',
      title_mr: 'क्विझ किंवा जोड्या जुळवा (Practice Drill)',
      title_hi: 'क्विज़ या जोड़ी मिलान हल करें',
      title_en: 'Solve a Practice Quiz',
      screen: 'Practice',
      icon: Award,
      color: COLORS.accent,
      completed: true,
      xp: 20,
    },
    {
      id: 'task4',
      title_mr: 'AI शी १ संभाषण किंवा उच्चारण सराव (Speaking)',
      title_hi: 'AI के साथ बातचीत या उच्चारण अभ्यास',
      title_en: 'Practice Speaking with AI',
      screen: 'Speaking',
      icon: Mic,
      color: COLORS.speak,
      completed: false,
      xp: 30,
    },
  ]);

  // Load daily tasks completion
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(DAILY_TASKS_KEY);
        if (stored) {
          const completedIds = JSON.parse(stored);
          setTasks(prev =>
            prev.map(t => ({ ...t, completed: completedIds.includes(t.id) }))
          );
        }
      } catch (e) {}
    };
    loadTasks();
  }, []);

  const toggleTask = async (id) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);

    const completedIds = updated.filter(t => t.completed).map(t => t.id);
    try {
      await AsyncStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(completedIds));
    } catch (e) {}

    const allDone = updated.every(t => t.completed);
    if (allDone) {
      Alert.alert(
        language === 'mr' ? 'सर्व कार्ये पूर्ण! 🏆' : 'All Tasks Completed! 🏆',
        language === 'mr'
          ? 'तुम्ही आजचे सर्व दैनंदिन ध्येय पूर्ण केले आहेत! सातत्य कायम ठेवा (+१०० XP)'
          : 'You completed all daily tasks! Day streak preserved (+100 XP)'
      );
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Daily Goal Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.badge}>
              <Target size={14} color="#C2410C" />
              <Text style={styles.badgeText}>
                {language === 'mr' ? 'आजचे दैनिक ध्येय' : 'Daily Challenge'}
              </Text>
            </View>

            <View style={styles.streakBadge}>
              <Flame size={16} color={COLORS.streak} />
              <Text style={styles.streakBadgeText}>{streak} {language === 'mr' ? 'दिवस' : 'Days'}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {language === 'mr' ? 'दररोज १५ मिनिटे इंग्रजी शिका!' : 'Learn English 15 Mins Daily!'}
          </Text>
          <Text style={styles.heroSub}>
            {language === 'mr'
              ? 'खालील सर्व कार्ये पूर्ण करून आजची सातत्य साखळी टिकवून ठेवा.'
              : 'Complete all 4 steps to keep your learning streak burning strong.'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>
                {completedCount} / {tasks.length} {language === 'mr' ? 'पूर्ण' : 'Completed'}
              </Text>
              <Text style={styles.progressPctText}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Tasks Checklist */}
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionHeading}>
            {language === 'mr' ? 'आजची कार्य यादी (To-Do List)' : "Today's Checklist"}
          </Text>

          {tasks.map(task => {
            const Icon = task.icon;
            return (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.85}
              >
                <TouchableOpacity
                  style={styles.checkboxTouch}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle2 size={24} color={COLORS.secondary} />
                  ) : (
                    <Circle size={24} color={COLORS.border} />
                  )}
                </TouchableOpacity>

                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleDone,
                    ]}
                  >
                    {language === 'hi' && task.title_hi
                      ? task.title_hi
                      : (language === 'en' ? task.title_en : task.title_mr)}
                  </Text>
                  <View style={styles.taskMetaRow}>
                    <Text style={[styles.taskXpBadge, { color: task.color }]}>
                      +{task.xp} XP
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.taskGoBtn, { backgroundColor: task.color }]}
                  onPress={() => navigation.navigate(task.screen)}
                >
                  <ArrowRight size={16} color={COLORS.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* All Tasks Completed Banner */}
        {progressPercent === 100 && (
          <View style={styles.allDoneBanner}>
            <Trophy size={36} color="#EAB308" />
            <Text style={styles.allDoneTitle}>
              {language === 'mr' ? 'आजचे सर्व सराव पूर्ण झाले! 🏆' : 'All Tasks Completed! 🏆'}
            </Text>
            <Text style={styles.allDoneSub}>
              {language === 'mr'
                ? 'उत्कृष्ट कामगिरी! तुमची प्रगती तपासा किंवा पुढील सराव सुरू ठेवा.'
                : 'Awesome work! Check your progress analytics or continue exploring.'}
            </Text>
            <TouchableOpacity
              style={styles.viewProgressBtn}
              onPress={() => navigation.navigate('Progress')}
            >
              <Text style={styles.viewProgressBtnText}>
                {language === 'mr' ? 'माझी प्रगती पहा ➔' : 'View Progress ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
  heroCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: RADIUS.xl,
    padding: SPACING.l,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    marginBottom: SPACING.l,
    ...SHADOWS.card,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C2410C',
    textTransform: 'uppercase',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  streakBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.m,
  },
  progressWrap: {},
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressPctText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#FED7AA',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: RADIUS.full,
  },
  tasksContainer: {
    gap: SPACING.m,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    gap: SPACING.m,
    ...SHADOWS.card,
  },
  taskCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  checkboxTouch: {
    padding: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  taskTitleDone: {
    color: '#15803D',
  },
  taskMetaRow: {
    flexDirection: 'row',
  },
  taskXpBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  taskGoBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allDoneBanner: {
    marginTop: SPACING.l,
    backgroundColor: '#FEFCE8',
    borderRadius: RADIUS.xl,
    padding: SPACING.l,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    ...SHADOWS.card,
  },
  allDoneTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#854D0E',
    marginTop: 8,
    marginBottom: 4,
  },
  allDoneSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  viewProgressBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  viewProgressBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
