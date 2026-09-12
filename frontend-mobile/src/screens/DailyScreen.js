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
  Calendar,
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
      color: COLORS.accentGreen,
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
      color: COLORS.accentAmberDark,
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
            prev.map(tk => ({ ...tk, completed: completedIds.includes(tk.id) }))
          );
        }
      } catch (e) {}
    };
    loadTasks();
  }, []);

  const toggleTask = async (id) => {
    const updated = tasks.map(tk => (tk.id === id ? { ...tk, completed: !tk.completed } : tk));
    setTasks(updated);
    const completedIds = updated.filter(tk => tk.completed).map(tk => tk.id);
    try {
      await AsyncStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(completedIds));
    } catch (e) {}
  };

  const completedCount = tasks.filter(tk => tk.completed).length;
  const totalXP = tasks.filter(tk => tk.completed).reduce((acc, curr) => acc + curr.xp, 0);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.badge}>
              <Target size={14} color={COLORS.primaryDark} />
              <Text style={styles.badgeText}>{language === 'mr' ? 'आजचे आव्हान' : 'Daily Challenge'}</Text>
            </View>
            <View style={styles.streakTag}>
              <Flame size={14} color={COLORS.primary} fill={COLORS.primary} />
              <Text style={styles.streakTagText}>{streak} {language === 'mr' ? 'दिवस सातत्य' : 'Days'}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{language === 'mr' ? 'दररोज ५ मिनिटांचे मिशन!' : 'Daily 5-Minute Mission!'}</Text>
          <Text style={styles.heroSub}>
            {language === 'mr'
              ? 'दररोज नियमित अभ्यास केल्याने तुम्ही कमी वेळात आत्मविश्वासाने इंग्रजी बोलू शकाल.'
              : 'Consistent 5-minute daily practice turns into effortless English fluency.'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfoRow}>
              <Text style={styles.progressLabel}>
                {language === 'mr' ? `पूर्ण: ${completedCount}/${tasks.length} मिशन्स` : `Completed: ${completedCount}/${tasks.length}`}
              </Text>
              <Text style={styles.xpText}>+{totalXP} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(completedCount / tasks.length) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Motivational Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "English शिकण्यासाठी आधी English येणे गरजेचे नाही, फक्त रोज ५ मिनिटे सराव पुरेसा आहे!"
          </Text>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionHeading}>{language === 'mr' ? 'आजचे कार्य (Today\'s Tasks):' : 'Today\'s Checklist:'}</Text>

          <View style={styles.tasksList}>
            {tasks.map((task, idx) => {
              const TaskIcon = task.icon;
              return (
                <View key={task.id} style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
                  <TouchableOpacity
                    style={styles.checkboxBtn}
                    onPress={() => toggleTask(task.id)}
                    activeOpacity={0.7}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} color={COLORS.accentGreen} />
                    ) : (
                      <Circle size={24} color={COLORS.textLight} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.taskInfoCol}
                    onPress={() => navigation.navigate(task.screen)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.taskTitleRow}>
                      <View style={[styles.taskIconBadge, { backgroundColor: `${task.color}15` }]}>
                        <TaskIcon size={16} color={task.color} />
                      </View>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleCompleted,
                        ]}
                      >
                        {language === 'mr' ? task.title_mr : language === 'hi' ? task.title_hi : task.title_en}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.taskActionBtn}
                    onPress={() => navigation.navigate(task.screen)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.taskXpTag}>+{task.xp} XP</Text>
                    <ArrowRight size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
    marginBottom: SPACING.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.streakBg,
    paddingHorizontal: 8,
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
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressContainer: {
    gap: 6,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.accentGreen,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  quoteCard: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondaryDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  tasksSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  tasksList: {
    gap: 10,
  },
  taskCard: {
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
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  checkboxBtn: {
    padding: 2,
  },
  taskInfoCol: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskIconBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
    flex: 1,
  },
  taskTitleCompleted: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  taskActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  taskXpTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
