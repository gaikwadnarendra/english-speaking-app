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
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_VOCAB } from '../data/vocabData';

const FAVORITES_STORAGE_KEY = '@english_shika_fav_words';

export default function FavoritesScreen() {
  const { t, language } = useApp();
  const [favoriteIds, setFavoriteIds] = useState([3, 4, 7, 14, 15, 18]);
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
        {/* Banner */}
        <View style={styles.headerCard}>
          <View style={styles.badge}>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <Text style={styles.badgeText}>{language === 'mr' ? 'माझे शब्द' : 'Bookmarks'}</Text>
          </View>
          <Text style={styles.headerTitle}>
            {language === 'mr' ? 'सेव्ह केलेले शब्द' : language === 'hi' ? 'सहेजे गए शब्द' : 'Saved Favorites'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'mr'
              ? 'जलद उजळणीसाठी तुम्ही सेव्ह केलेले सर्व शब्द येथे उपलब्ध आहेत.'
              : 'Review and listen to words you have bookmarked for practice.'}
          </Text>
        </View>

        {/* Search within favorites */}
        <View style={styles.searchBox}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'mr' ? 'सेव्ह केलेले शब्द शोधा...' : 'Search favorites...'}
            placeholderTextColor={COLORS.textMuted}
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
        <View style={styles.wordsList}>
          {filteredWords.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={44} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>
                {language === 'mr' ? 'कोणताही शब्द सेव्ह केलेला नाही' : 'No favorites saved yet'}
              </Text>
              <Text style={styles.emptySub}>
                {language === 'mr'
                  ? 'शब्दसंग्रहातून शब्द सेव्ह करण्यासाठी हार्ट चिन्हावर टॅप करा.'
                  : 'Tap the heart icon in Vocabulary to save words for quick revision.'}
              </Text>
            </View>
          ) : (
            filteredWords.map(item => (
              <View key={item.id} style={styles.wordCard}>
                <View style={styles.wordCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wordEn}>{item.word}</Text>
                    <Text style={styles.wordPron}>/{item.pronunciation}/</Text>
                  </View>
                  <View style={styles.actionBtns}>
                    <AudioButton text={item.word} size={34} />
                    <TouchableOpacity
                      onPress={() => removeFavorite(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.meaningsRow}>
                  <Text style={styles.meaningLabel}>मराठी:</Text>
                  <Text style={styles.meaningVal}>{item.marathi}</Text>
                </View>

                {item.hindi && (
                  <View style={styles.meaningsRow}>
                    <Text style={styles.meaningLabel}>हिंदी:</Text>
                    <Text style={styles.meaningVal}>{item.hindi}</Text>
                  </View>
                )}

                {item.examples && item.examples[0] && (
                  <View style={styles.exampleBox}>
                    <View style={styles.exampleRow}>
                      <Text style={styles.exampleEn}>"{item.examples[0].english}"</Text>
                      <AudioButton text={item.examples[0].english} size={24} />
                    </View>
                    <Text style={styles.exampleLoc}>
                      {language === 'hi' && item.examples[0].hindi
                        ? item.examples[0].hindi
                        : item.examples[0].marathi}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
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
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.m,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.m,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  wordsList: {
    gap: SPACING.m,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.m,
    ...SHADOWS.card,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.m,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  wordCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    ...SHADOWS.card,
  },
  wordCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  wordEn: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  wordPron: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  meaningsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 3,
  },
  meaningLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  meaningVal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  exampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.s,
    marginTop: SPACING.s,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  exampleEn: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 6,
  },
  exampleLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
