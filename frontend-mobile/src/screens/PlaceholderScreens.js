import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  BookOpen,
  Sparkles,
  Award,
  Mic,
  Calendar,
  Heart,
  TrendingUp,
  Settings,
  ArrowLeft,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

function PlaceholderBase({ title, subtitle, icon: Icon, phase, color }) {
  const navigation = useNavigation();
  const { language } = useApp();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
          <Icon size={48} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color }]}>{phase}</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <ArrowLeft size={18} color={COLORS.primary} />
          <Text style={styles.backBtnText}>
            {language === 'mr' ? 'मुख्य पृष्ठावर जा' : language === 'hi' ? 'होम पेज पर जाएं' : 'Back to Home'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function LearnScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'इंग्रजी व्याकरण व धडे' : language === 'hi' ? 'अंग्रेजी व्याकरण व पाठ' : 'Grammar & Lessons'}
      subtitle={
        language === 'mr'
          ? '६०+ चरणबद्ध धडे आणि नियम मराठी स्पष्टीकरणासह.'
          : language === 'hi'
          ? '६०+ चरणबद्ध पाठ हिंदी स्पष्टीकरण के साथ।'
          : '60+ step-by-step grammar lessons with native explanations.'
      }
      icon={BookOpen}
      phase="Coming in Phase 2"
      color={COLORS.primary}
    />
  );
}

export function VocabScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'शब्दसंग्रह आणि क्रियापदे' : language === 'hi' ? 'शब्दावली और क्रिया रूप' : 'Vocabulary & Verbs'}
      subtitle={
        language === 'mr'
          ? '१५००+ आवश्यक शब्द, V1-V2-V3 क्रियापदे, शोध व ऑडिओ.'
          : language === 'hi'
          ? '१५००+ महत्वपूर्ण शब्द, V1-V2-V3 रूप और ऑडियो।'
          : '1500+ words with V1-V2-V3 forms, search & TTS pronunciation.'
      }
      icon={Sparkles}
      phase="Coming in Phase 3"
      color={COLORS.secondary}
    />
  );
}

export function PracticeScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'क्विझ व वाक्य सराव' : language === 'hi' ? 'क्विज़ और अभ्यास' : 'Quizzes & Practice'}
      subtitle={
        language === 'mr'
          ? 'MCQ क्विझ, जोड्या जुळवा, वाक्य रचना व स्कोअरिंग.'
          : language === 'hi'
          ? 'बहुविकल्पीय प्रश्न, जोड़ी मिलान और वाक्य निर्माण।'
          : 'Interactive MCQs, Match Pairs, and Sentence Builders.'
      }
      icon={Award}
      phase="Coming in Phase 4"
      color={COLORS.accent}
    />
  );
}

export function SpeakingScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'AI इंग्रजी संभाषण' : language === 'hi' ? 'AI अंग्रेजी वार्तालाप' : 'AI Speaking & Pronunciation'}
      subtitle={
        language === 'mr'
          ? 'माईक द्वारे AI शी थेट इंग्रजीत बोला आणि उच्चारण स्कोअर मिळवा.'
          : language === 'hi'
          ? 'माइक से AI के साथ बोलें और उच्चारण स्कोर पाएं।'
          : 'Live voice practice with Gemini AI and real-time pronunciation scoring.'
      }
      icon={Mic}
      phase="Coming in Phase 5"
      color={COLORS.speak}
    />
  );
}

export function DailyScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'आजचा संपूर्ण सराव' : language === 'hi' ? 'आज का सम्पूर्ण अभ्यास' : "Today's Full Lesson"}
      subtitle={
        language === 'mr'
          ? '५ शब्द + ३ वाक्ये + १ क्विझ + ऑडिओ उच्चार.'
          : language === 'hi'
          ? '५ शब्द + ३ वाक्य + १ क्विज़ + ऑडियो।'
          : 'Daily dose of 5 words, 3 sentences, and mini quiz.'
      }
      icon={Calendar}
      phase="Coming in Phase 6"
      color={COLORS.primary}
    />
  );
}

export function FavoritesScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'माझे सेव्ह केलेले शब्द' : language === 'hi' ? 'पसंदीदा शब्द' : 'Saved Favorites'}
      subtitle={
        language === 'mr'
          ? 'तुम्ही बुकमार्क केलेले शब्द आणि वाक्ये येथे दिसतील.'
          : language === 'hi'
          ? 'सहेजे गए शब्द और वाक्य यहाँ दिखेंगे।'
          : 'Your bookmarked words and sentences for quick revision.'
      }
      icon={Heart}
      phase="Coming in Phase 6"
      color="#EF4444"
    />
  );
}

export function ProgressScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'माझा शिकण्याचा वेग' : language === 'hi' ? 'मेरी प्रगति' : 'Learning Progress'}
      subtitle={
        language === 'mr'
          ? 'दिवसांची सातत्य साखळी, सोडवलेले प्रश्न आणि यश पदके.'
          : language === 'hi'
          ? 'सत्र प्रगति, हल किए गए प्रश्न और बैज।'
          : 'Streak calendar, lessons completed, accuracy rates, and badges.'
      }
      icon={TrendingUp}
      phase="Coming in Phase 6"
      color="#8B5CF6"
    />
  );
}

export function SettingsScreen() {
  const { language } = useApp();
  return (
    <PlaceholderBase
      title={language === 'mr' ? 'अ‍ॅप सेटिंग्ज' : language === 'hi' ? 'ऐप सेटिंग्स' : 'App Settings'}
      subtitle={
        language === 'mr'
          ? 'भाषा बदला, आवाज वेग नियंत्रित करा आणि डेटा रीसेट करा.'
          : language === 'hi'
          ? 'भाषा, आवाज की गति और डेटा बदलें।'
          : 'Change app language, TTS speech speed, and reset data.'
      }
      icon={Settings}
      phase="Coming in Phase 6"
      color={COLORS.textMuted}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.l,
    maxWidth: 280,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.xl,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: SPACING.l,
    borderRadius: RADIUS.md,
    ...SHADOWS.card,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
