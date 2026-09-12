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
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import { api } from '../config/api';

export default function ProgressScreen() {
  const { t, language, streak, userLevel } = useApp();

  const [stats, setStats] = useState({
    wordsLearned: 28,
    lessonsFinished: 3,
    quizzesSolved: 14,
    speakingPracticed: 8,
    totalXp: 380,
  });

  // Fetch online progress stats if available
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/api/progress/stats');
        if (res.data?.data) {
          setStats(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {}
    };
    loadStats();
  }, []);

  const milestones = [
    {
      level: 1,
      title: language === 'mr' ? 'स्तर १: नवशिक्या (Beginner)' : 'Level 1: Beginner',
      desc: language === 'mr' ? 'मूलभूत मुळाक्षरे व ५० शब्द' : 'Starter phonics & 50 starter words',
      unlocked: true,
      completed: true,
    },
    {
      level: 2,
      title: language === 'mr' ? 'स्तर २: दैनंदिन संभाषण' : 'Level 2: Daily Life',
      desc: language === 'mr' ? 'रोजच्या सवयी आणि क्रियापद रूपे' : 'Daily routines & V1-V2-V3 verbs',
      unlocked: true,
      completed: false,
    },
    {
      level: 3,
      title: language === 'mr' ? 'स्तर ३: व्याकरण व काळ' : 'Level 3: Grammar Master',
      desc: language === 'mr' ? 'भूतकाळ, वर्तमानकाळ आणि वाक्यरचना' : 'Tenses, sentence builders & rules',
      unlocked: true,
      completed: false,
    },
    {
      level: 4,
      title: language === 'mr' ? 'स्तर ४: अस्खलित संभाषण' : 'Level 4: Fluent Speaker',
      desc: language === 'mr' ? 'हॉटेल, प्रवास आणि सार्वजनिक संवाद' : 'Public speaking & shopping dialogues',
      unlocked: false,
      completed: false,
    },
    {
      level: 5,
      title: language === 'mr' ? 'स्तर ५: प्रगत व्यावसायिक' : 'Level 5: English Guru',
      desc: language === 'mr' ? 'नोकरी मुलाखत व व्यावसायिक इंग्रजी' : 'Job interviews & professional mastery',
      unlocked: false,
      completed: false,
    },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.badge}>
              <TrendingUp size={14} color="#7C3AED" />
              <Text style={styles.badgeText}>{language === 'mr' ? 'माझी प्रगती' : 'My Progress'}</Text>
            </View>
            <View style={styles.xpPill}>
              <Award size={16} color={COLORS.accent} />
              <Text style={styles.xpPillText}>{stats.totalXp} XP</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {language === 'mr' ? 'शिकण्याचा वेग व आकडेवारी' : 'Learning Analytics & Milestones'}
          </Text>
          <Text style={styles.heroSub}>
            {language === 'mr'
              ? 'दररोजच्या अभ्यासातून मिळवलेले गुण आणि पूर्ण केलेले टप्पे.'
              : 'Keep track of words memorized, quizzes solved, and level milestones.'}
          </Text>
        </View>

        {/* 4 Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { borderLeftColor: COLORS.secondary }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Sparkles size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.statNum}>{stats.wordsLearned}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'शिकलेले शब्द' : 'Words Mastered'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.primary }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <BookOpen size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statNum}>{stats.lessonsFinished}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'पूर्ण धडे' : 'Lessons Finished'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.accent }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FFFBEB' }]}>
              <Award size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.statNum}>{stats.quizzesSolved}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'सोडवलेले क्विझ' : 'Quizzes Solved'}</Text>
          </View>

          <View style={[styles.statBox, { borderLeftColor: COLORS.speak }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FDF2F8' }]}>
              <Mic size={20} color={COLORS.speak} />
            </View>
            <Text style={styles.statNum}>{stats.speakingPracticed}</Text>
            <Text style={styles.statLabel}>{language === 'mr' ? 'AI संभाषणे' : 'Speaking Sessions'}</Text>
          </View>
        </View>

        {/* Streak Flame Card */}
        <View style={styles.streakCard}>
          <Flame size={36} color={COLORS.streak} />
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>
              {streak} {language === 'mr' ? 'दिवसांची सातत्य साखळी!' : 'Days Learning Streak!'}
            </Text>
            <Text style={styles.streakSub}>
              {language === 'mr'
                ? 'दररोज सराव केल्याने इंग्रजी बोलण्याचा आत्मविश्वास वाढतो.'
                : 'Consistent daily practice creates long-term fluent memory.'}
            </Text>
          </View>
        </View>

        {/* 5-Level Milestones Roadmap */}
        <View style={styles.milestonesSection}>
          <Text style={styles.sectionHeading}>
            {language === 'mr' ? 'अभ्यासक्रम टप्पे (Curriculum Milestones)' : 'Curriculum Milestones'}
          </Text>

          {milestones.map((m, idx) => (
            <View key={m.level} style={[styles.milestoneCard, !m.unlocked && styles.milestoneLocked]}>
              <View style={styles.milestoneLeft}>
                <View
                  style={[
                    styles.milestoneBadge,
                    m.completed
                      ? styles.mbCompleted
                      : m.unlocked
                      ? styles.mbUnlocked
                      : styles.mbLocked,
                  ]}
                >
                  {m.completed ? (
                    <CheckCircle2 size={20} color={COLORS.white} />
                  ) : !m.unlocked ? (
                    <Lock size={18} color={COLORS.textMuted} />
                  ) : (
                    <Text style={styles.mbNumText}>L{m.level}</Text>
                  )}
                </View>
              </View>

              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text style={styles.milestoneDesc}>{m.desc}</Text>
              </View>

              <View>
                <Text
                  style={[
                    styles.milestoneStatus,
                    m.completed
                      ? { color: COLORS.secondary }
                      : m.unlocked
                      ? { color: COLORS.primary }
                      : { color: COLORS.textMuted },
                  ]}
                >
                  {m.completed
                    ? (language === 'mr' ? 'पूर्ण 🏆' : 'Done 🏆')
                    : m.unlocked
                    ? (language === 'mr' ? 'चालू' : 'Active')
                    : (language === 'mr' ? 'कुलूपबंद' : 'Locked')}
                </Text>
              </View>
            </View>
          ))}
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
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.l,
    marginBottom: SPACING.m,
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
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  xpPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    gap: SPACING.m,
    marginBottom: SPACING.l,
    ...SHADOWS.card,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 2,
  },
  streakSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  milestonesSection: {
    gap: SPACING.s,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    gap: SPACING.m,
    ...SHADOWS.card,
  },
  milestoneLocked: {
    opacity: 0.6,
  },
  milestoneLeft: {},
  milestoneBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbCompleted: {
    backgroundColor: COLORS.secondary,
  },
  mbUnlocked: {
    backgroundColor: COLORS.primary,
  },
  mbLocked: {
    backgroundColor: '#E5E7EB',
  },
  mbNumText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  milestoneDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  milestoneStatus: {
    fontSize: 12,
    fontWeight: '800',
  },
});
