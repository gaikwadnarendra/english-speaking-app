import React from 'react';
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
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, language, userLevel, streak, todaySnapshot, refreshTodaySnapshot, isLoading } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'mr' ? 'शुभ प्रभात! 🌅' : language === 'hi' ? 'शुभ प्रभात! 🌅' : 'Good Morning! 🌅';
    }
    if (hour < 17) {
      return language === 'mr' ? 'शुभ दुपार! ☀️' : language === 'hi' ? 'शुभ दोपहर! ☀️' : 'Good Afternoon! ☀️';
    }
    return language === 'mr' ? 'शुभ संध्याकाळ! 🌙' : language === 'hi' ? 'शुभ संध्या! 🌙' : 'Good Evening! 🌙';
  };

  const getLevelLabel = () => {
    switch (userLevel) {
      case 'beginner':
        return language === 'mr' ? 'नवशिक्या (Beginner)' : language === 'hi' ? 'शुरुआती (Beginner)' : 'Beginner (A1)';
      case 'intermediate':
        return language === 'mr' ? 'मध्यम (Intermediate)' : language === 'hi' ? 'मध्यम (Intermediate)' : 'Intermediate (B1)';
      case 'advanced':
        return language === 'mr' ? 'प्रगत (Advanced)' : language === 'hi' ? 'उन्नत (Advanced)' : 'Advanced (C1)';
      default:
        return 'Beginner';
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTodaySnapshot}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Welcome Greeting Banner */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingHeader}>
            <View>
              <Text style={styles.greetingSub}>{getGreeting()}</Text>
              <Text style={styles.greetingTitle}>
                {language === 'mr' ? 'आजचे इंग्रजी शिकूया!' : language === 'hi' ? 'आज का अंग्रेजी सीखें!' : "Let's Learn English Today!"}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Award size={14} color={COLORS.primary} />
              <Text style={styles.levelBadgeText}>{getLevelLabel()}</Text>
            </View>
          </View>

          {/* Streak Bar */}
          <View style={styles.streakStrip}>
            <Flame size={20} color={COLORS.streak} />
            <Text style={styles.streakText}>
              <Text style={styles.streakBold}>{streak} </Text>
              {language === 'mr'
                ? 'दिवसांचा सराव सातत्य! रोज शिका आणि इंग्रजी सुधारा.'
                : language === 'hi'
                ? 'दिनों की लकीर! रोज़ाना अभ्यास करें।'
                : 'Day streak! Keep learning every day.'}
            </Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryCta}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Daily')}
          >
            <Sparkles size={20} color={COLORS.white} />
            <Text style={styles.primaryCtaText}>
              {language === 'mr' ? 'आजचा सराव सुरू करा' : language === 'hi' ? 'आज का अभ्यास शुरू करें' : "Start Today's Lesson"}
            </Text>
            <ChevronRight size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Module Navigation Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? 'अभ्यास विभाग' : language === 'hi' ? 'अभ्यास अनुभाग' : 'Learning Modules'}
          </Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.gridCard, { borderLeftColor: COLORS.primary }]}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <BookOpen size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.gridTitle}>{t('learnTab')}</Text>
            <Text style={styles.gridSubtitle}>
              {language === 'mr' ? 'व्याकरण व धडे' : language === 'hi' ? 'व्याकरण और पाठ' : 'Grammar & Lessons'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { borderLeftColor: COLORS.secondary }]}
            onPress={() => navigation.navigate('Vocab')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Sparkles size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.gridTitle}>{t('vocabTab')}</Text>
            <Text style={styles.gridSubtitle}>
              {language === 'mr' ? 'शब्दसंग्रह आणि V1-V3' : language === 'hi' ? 'शब्दावली और रूप' : 'Words & Verbs'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { borderLeftColor: COLORS.accent }]}
            onPress={() => navigation.navigate('Practice')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: '#FFFBEB' }]}>
              <Award size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.gridTitle}>{t('practiceTab')}</Text>
            <Text style={styles.gridSubtitle}>
              {language === 'mr' ? 'क्विझ व वाक्य रचना' : language === 'hi' ? 'क्विज़ और वाक्य' : 'Quizzes & Exercises'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { borderLeftColor: COLORS.speak }]}
            onPress={() => navigation.navigate('Speaking')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: '#FDF2F8' }]}>
              <Mic size={24} color={COLORS.speak} />
            </View>
            <Text style={styles.gridTitle}>{t('speakTab')}</Text>
            <Text style={styles.gridSubtitle}>
              {language === 'mr' ? 'AI संभाषण व उच्चार' : language === 'hi' ? 'AI बातचीत' : 'AI Speaking Practice'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's 5 Vocabulary Snapshot */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? 'आजचे ५ खास शब्द' : language === 'hi' ? 'आज के ५ शब्द' : "Today's 5 Words"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vocab')}>
            <Text style={styles.sectionLink}>
              {language === 'mr' ? 'सर्व पहा' : language === 'hi' ? 'सभी देखें' : 'View All'} →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wordsContainer}>
          {todaySnapshot.words.map((item, idx) => (
            <View key={idx} style={styles.wordCard}>
              <View style={styles.wordLeft}>
                <View style={styles.wordNumBadge}>
                  <Text style={styles.wordNumText}>{idx + 1}</Text>
                </View>
                <View>
                  <Text style={styles.wordEn}>{item.word}</Text>
                  <Text style={styles.wordMeaning}>
                    {language === 'mr' ? item.meaningMr : language === 'hi' ? item.meaningHi : item.meaningMr}
                  </Text>
                </View>
              </View>
              <AudioButton text={item.word} size={36} />
            </View>
          ))}
        </View>

        {/* Today's Daily Sentences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'mr' ? 'दैनंदिन वापरातील वाक्ये' : language === 'hi' ? 'दैनिक वाक्य' : 'Daily Useful Sentences'}
          </Text>
        </View>

        <View style={styles.sentencesContainer}>
          {todaySnapshot.sentences.map((sent, idx) => (
            <View key={idx} style={styles.sentenceCard}>
              <View style={styles.sentenceRow}>
                <Text style={styles.sentenceEn}>{sent.en}</Text>
                <AudioButton text={sent.en} size={32} />
              </View>
              <Text style={styles.sentenceNative}>
                {language === 'mr' ? sent.mr : language === 'hi' ? sent.hi : sent.mr}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Quiz Card preview */}
        {todaySnapshot.quiz && (
          <View style={styles.quizTeaserCard}>
            <View style={styles.quizTeaserHeader}>
              <CheckCircle2 size={20} color={COLORS.secondary} />
              <Text style={styles.quizTeaserTitle}>
                {language === 'mr' ? 'आजचा झटपट सराव प्रश्न' : language === 'hi' ? 'आज का त्वरित प्रश्न' : "Today's Quick Question"}
              </Text>
            </View>
            <Text style={styles.quizQuestion}>{todaySnapshot.quiz.question}</Text>
            <TouchableOpacity
              style={styles.quizBtn}
              onPress={() => navigation.navigate('Practice')}
              activeOpacity={0.8}
            >
              <Text style={styles.quizBtnText}>
                {language === 'mr' ? 'सराव सोडवा (+10 गुण)' : language === 'hi' ? 'हल करें (+10 अंक)' : 'Solve Quiz (+10 XP)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
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
  greetingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    ...SHADOWS.card,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  streakStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: RADIUS.md,
    padding: SPACING.s,
    marginBottom: SPACING.m,
    gap: SPACING.xs,
  },
  streakText: {
    fontSize: 12,
    color: '#C2410C',
    flex: 1,
  },
  streakBold: {
    fontWeight: '800',
    fontSize: 14,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.l,
    gap: SPACING.s,
    ...SHADOWS.button,
  },
  primaryCtaText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
    gap: SPACING.s,
  },
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  gridIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  wordsContainer: {
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    ...SHADOWS.card,
  },
  wordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    flex: 1,
  },
  wordNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  wordEn: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  wordMeaning: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sentencesContainer: {
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  sentenceCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    ...SHADOWS.card,
  },
  sentenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sentenceEn: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  sentenceNative: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  quizTeaserCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  quizTeaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.s,
  },
  quizTeaserTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  quizBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quizBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
