import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Heart,
  Search,
  BookOpen,
  X,
  Volume2,
  Trash2,
  Sparkles,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_VOCAB } from '../data/vocabData';

const FAVORITES_STORAGE_KEY = '@english_shika_fav_words';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { t, language } = useApp();
  const [favoriteIds, setFavoriteIds] = useState([1, 2, 3, 5]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) setFavoriteIds(JSON.parse(stored));
      } catch (e) {}
    };
    loadFavs();
  }, []);

  const removeFavorite = async (id) => {
    const updated = favoriteIds.filter(favId => favId !== id);
    setFavoriteIds(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const favoriteWords = useMemo(() => {
    return INITIAL_VOCAB.filter(w => favoriteIds.includes(w.id));
  }, [favoriteIds]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favoriteWords;
    return favoriteWords.filter(
      w =>
        (w.word && w.word.toLowerCase().includes(q)) ||
        (w.marathi && w.marathi.includes(q)) ||
        (w.hindi && w.hindi.includes(q))
    );
  }, [favoriteWords, searchQuery]);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.titleBlock}>
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Heart size={13} color="#EF4444" fill="#EF4444" />
              <Text style={styles.badgePillText}>{language === 'mr' ? 'माझे आवडते शब्द' : 'Saved Vocabulary'}</Text>
            </View>
            <Text style={styles.countText}>{favoriteWords.length} {language === 'mr' ? 'शब्द सेव्ह' : 'words'}</Text>
          </View>
          <Text style={styles.mainTitle}>{language === 'mr' ? 'जतन केलेले शब्दसंग्रह' : 'Bookmarked Words'}</Text>
          <Text style={styles.mainSub}>
            {language === 'mr'
              ? 'तुम्ही सेव्ह केलेले सर्व कठीण आणि महत्त्वाचे शब्द येथे उजळणीसाठी उपलब्ध आहेत.'
              : 'Quickly access and revise all your starred vocabulary words.'}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'mr' ? 'सेव्ह केलेले शब्द शोधा...' : 'Search saved words...'}
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Words List */}
        {filteredWords.length === 0 ? (
          <View style={styles.emptyCard}>
            <Heart size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>
              {language === 'mr' ? 'अद्याप कोणतेही शब्द सेव्ह केलेले नाहीत' : 'No favorites added yet'}
            </Text>
            <Text style={styles.emptySub}>
              {language === 'mr'
                ? 'शब्दसंग्रहामध्ये शब्दाच्या समोरील ❤️ आयकॉनवर टॅप करून शब्द सेव्ह करा.'
                : 'Tap the heart icon on any word in the Vocabulary tab to add it here.'}
            </Text>
            <TouchableOpacity
              style={styles.goToVocabBtn}
              onPress={() => navigation.navigate('Vocab')}
            >
              <Sparkles size={16} color={COLORS.white} />
              <Text style={styles.goToVocabBtnText}>{language === 'mr' ? 'शब्दसंग्रह पहा' : 'Explore Vocab'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.wordsList}>
            {filteredWords.map((item, idx) => (
              <View key={item.id || idx} style={styles.favWordCard}>
                <View style={styles.cardLeftCol}>
                  <View style={styles.wordTitleRow}>
                    <Text style={styles.wordEnText}>{item.word}</Text>
                    <Text style={styles.wordPronText}>({item.pronunciation || ''})</Text>
                  </View>
                  <Text style={styles.wordLocText}>
                    {language === 'mr' ? item.marathi : language === 'hi' ? item.hindi : item.marathi}
                  </Text>
                </View>

                <View style={styles.cardActionsRow}>
                  <AudioButton text={item.word} size={36} />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeFavorite(item.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  titleBlock: {
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  mainSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMain,
    padding: 0,
  },
  wordsList: {
    gap: 10,
  },
  favWordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardLeftCol: {
    flex: 1,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  wordEnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  wordPronText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  wordLocText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: RADIUS.full,
    backgroundColor: '#FEE2E2',
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  goToVocabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  goToVocabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
});
