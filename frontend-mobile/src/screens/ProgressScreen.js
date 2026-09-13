import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Mic,
  Flame,
  CheckCircle2,
  Lock,
  Calendar,
  Trophy,
  Target,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import { api } from '../config/api';

export default function ProgressScreen() {
  const { t, language, streak, userLevel } = useApp();
  const { LEVELS, isLevelComplete, isLevelUnlocked, isTaskCompleted } = useProgress();

  const [stats, setStats] = useState({
    wordsLearned: 145,
    lessonsFinished: 5,
    quizzesSolved: 18,
    speakingPracticed: 12,
    totalXp: 420,
  });

  // Fetch online stats if available
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/progress');
        if (res.data?.data) {
          setStats(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {}
    };
    loadStats();
  }, []);

  const milestones = LEVELS.map(lvl => ({
    level: lvl.id,
    title: language === 'mr' ? lvl.nameMr : lvl.name,
    desc: `${lvl.tasks.filter(t => isTaskCompleted(lvl.id, t.key)).length}/${lvl.tasks.length} ${language === 'mr' ? 'टास्क पूर्ण' : 'tasks done'}`,
    unlocked: isLevelUnlocked(lvl.id),
    completed: isLevelComplete(lvl.id),
  }));

  const badges = [
    { id: 1, title: language === 'mr' ? 'पहिले पाऊल' : 'First Step', icon: '🚀', desc: language === 'mr' ? 'पहिला धडा पूर्ण' : 'Completed first lesson', earned: true },
    { id: 2, title: language === 'mr' ? 'सराव सातत्य' : 'Streak Hero', icon: '🔥', desc: language === 'mr' ? '३ दिवस सलग सराव' : '3-day learning streak', earned: true },
    { id: 3, title: language === 'mr' ? 'शब्दभांडार' : 'Vocab Master', icon: '📚', desc: language === 'mr' ? '५०+ शब्द शिकले' : 'Learned 50+ words', earned: false },
    { id: 4, title: language === 'mr' ? 'बोलणारा' : 'Speaker Star', icon: '🎙️', desc: language === 'mr' ? '१० संभाषणे पूर्ण' : 'Completed 10 speaking chats', earned: true },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.badgePill}>
              <TrendingUp size={14} color={COLORS.secondary} />
              <Text style={styles.badgePillText}>{language === 'mr' ? 'माझी प्रगती' : 'My Learning Stats'}</Text>
            </View>
            <View style={styles.xpTag}>
              <Trophy size={14} color={COLORS.accentAmberDark} />
              <Text style={styles.xpTagText}>{stats.totalXp} XP</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {language === 'mr' ? 'तुमचा इंग्रजी शिकण्याचा प्रवास' : 'Your Learning Journey'}
          </Text>
          <Text style={styles.heroSub}>
            {language === 'mr'
              ? 'दररोजचा सराव तुम्हाला इंग्रजीत अस्खलित बनवत आहे.'
              : 'Every minute of daily practice brings you closer to fluent speaking.'}
          </Text>
        </View>

        {/* 4 Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { borderLeftColor: COLORS.primary }]}>
            <View style={[styles.statIconBadge, { backgroundColor: COLORS.primaryLight }]}>
              <BookOpen size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{stats.wordsLearned}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'शिकलेले शब्द' : 'Words Learned'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.secondary }]}>
            <View style={[styles.statIconBadge, { backgroundColor: COLORS.secondaryLight }]}>
              <Award size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.statNumber}>{stats.lessonsFinished}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'पूर्ण धडे' : 'Lessons Done'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.accentGreen }]}>
            <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentGreenLight }]}>
              <Target size={18} color={COLORS.accentGreen} />
            </View>
            <Text style={styles.statNumber}>{stats.quizzesSolved}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'क्विझ सराव' : 'Quizzes Solved'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.accentAmber }]}>
            <View style={[styles.statIconBadge, { backgroundColor: COLORS.accentAmberLight }]}>
              <Mic size={18} color={COLORS.accentAmberDark} />
            </View>
            <Text style={styles.statNumber}>{stats.speakingPracticed}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'संभाषणे' : 'Speaking Sessions'}</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🏆 {language === 'mr' ? 'मिळालेले सन्मान बॅजेस' : 'Achievement Badges'}</Text>
        </View>

        <View style={styles.badgesGrid}>
          {badges.map(b => (
            <View key={b.id} style={[styles.badgeCard, !b.earned && styles.badgeCardLocked]}>
              <Text style={styles.badgeEmoji}>{b.icon}</Text>
              <Text style={styles.badgeTitle}>{b.title}</Text>
              <Text style={styles.badgeDesc}>{b.desc}</Text>
              {b.earned ? (
                <View style={styles.earnedTag}>
                  <Text style={styles.earnedTagText}>{language === 'mr' ? 'मिळाला ✓' : 'Earned ✓'}</Text>
                </View>
              ) : (
                <View style={styles.lockedTag}>
                  <Lock size={10} color={COLORS.textLight} />
                  <Text style={styles.lockedTagText}>{language === 'mr' ? 'अनलॉक करा' : 'Locked'}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Levels Roadmap */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🗺️ {language === 'mr' ? 'स्तरांची प्रगती (Level Roadmap)' : 'Level Progress'}</Text>
        </View>

        <View style={styles.levelsList}>
          {milestones.map(m => (
            <View
              key={m.level}
              style={[
                styles.levelMilestoneCard,
                m.completed && styles.levelMilestoneCardCompleted,
                !m.unlocked && styles.levelMilestoneCardLocked,
              ]}
            >
              <View style={[styles.levelNumberCircle, m.completed && styles.levelNumberCircleCompleted]}>
                {m.completed ? (
                  <CheckCircle2 size={16} color={COLORS.white} />
                ) : m.unlocked ? (
                  <Text style={styles.levelNumberText}>L{m.level}</Text>
                ) : (
                  <Lock size={14} color={COLORS.textLight} />
                )}
              </View>

              <View style={styles.levelInfoCol}>
                <Text style={styles.levelMilestoneTitle}>{m.title}</Text>
                <Text style={styles.levelMilestoneDesc}>{m.desc}</Text>
              </View>
            </View>
          ))}
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
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  xpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentAmberLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  xpTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.accentAmberDark,
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionHeaderRow: {
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: SPACING.md,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: 4,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  earnedTag: {
    backgroundColor: COLORS.accentGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  earnedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accentGreenDark,
  },
  lockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  lockedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  levelsList: {
    gap: 8,
  },
  levelMilestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: 12,
  },
  levelMilestoneCardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentGreen,
  },
  levelMilestoneCardLocked: {
    opacity: 0.5,
  },
  levelNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumberCircleCompleted: {
    backgroundColor: COLORS.accentGreen,
  },
  levelNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  levelInfoCol: {
    flex: 1,
  },
  levelMilestoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  levelMilestoneDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
