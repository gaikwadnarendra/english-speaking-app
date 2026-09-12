import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {
  Sparkles,
  Search,
  BookMarked,
  Heart,
  LayoutGrid,
  Layers,
  Zap,
  CheckCircle2,
  X,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Filter,
  Volume2,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_VOCAB, INITIAL_VERBS } from '../data/vocabData';
import { api } from '../config/api';

const FAVORITES_STORAGE_KEY = '@english_shika_fav_words';

export default function VocabScreen() {
  const { t, language, speechRate } = useApp();

  // Mode: 'vocab' vs 'verbs'
  const [activeSection, setActiveSection] = useState('vocab');

  // Master Data
  const [vocabList, setVocabList] = useState(INITIAL_VOCAB);
  const [verbsList, setVerbsList] = useState(INITIAL_VERBS);
  const [favoriteIds, setFavoriteIds] = useState([1, 2, 3, 5]);

  // Vocab Filters
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'flashcards'
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Verbs Filters
  const [verbSearch, setVerbSearch] = useState('');

  // Load favorites
  useEffect(() => {
    const loadFavs = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) setFavoriteIds(JSON.parse(stored));
      } catch (e) {}
    };
    loadFavs();
  }, []);

  const toggleFavorite = async (id) => {
    const isFav = favoriteIds.includes(id);
    const updated = isFav ? favoriteIds.filter(fId => fId !== id) : [...favoriteIds, id];
    setFavoriteIds(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const categories = ['All', 'Daily', 'Food', 'Travel', 'Work', 'Emotion', 'Family'];

  // Filtered Vocab
  const filteredVocab = useMemo(() => {
    return vocabList.filter(w => {
      const q = vocabSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (w.word && w.word.toLowerCase().includes(q)) ||
        (w.marathi && w.marathi.includes(q)) ||
        (w.hindi && w.hindi.includes(q)) ||
        (w.pronunciation && w.pronunciation.includes(q));
      const matchesCategory =
        selectedCategory === 'All' ||
        (w.category && w.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [vocabList, vocabSearch, selectedCategory]);

  // Filtered Verbs
  const filteredVerbs = useMemo(() => {
    return verbsList.filter(vb => {
      const q = verbSearch.trim().toLowerCase();
      return (
        !q ||
        (vb.v1 && vb.v1.toLowerCase().includes(q)) ||
        (vb.v2 && vb.v2.toLowerCase().includes(q)) ||
        (vb.v3 && vb.v3.toLowerCase().includes(q)) ||
        (vb.marathi && vb.marathi.includes(q))
      );
    });
  }, [verbsList, verbSearch]);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.badgePill}>
            <Sparkles size={13} color={COLORS.secondary} />
            <Text style={styles.badgePillText}>{language === 'mr' ? 'शब्दभांडार' : 'Word Bank'}</Text>
          </View>
          <Text style={styles.mainTitle}>{language === 'mr' ? 'शब्दावली व क्रियापदे' : 'Vocabulary & Verbs'}</Text>
          <Text style={styles.mainSub}>
            {language === 'mr'
              ? 'दैनंदिन वापरातील ५००+ शब्द आणि महत्त्वाचे V1, V2, V3 क्रियापद रूपे.'
              : 'Master essential everyday English vocabulary and verb conjugations.'}
          </Text>
        </View>

        {/* Section Switcher (Vocabulary vs Verbs) */}
        <View style={styles.sectionSwitchRow}>
          <TouchableOpacity
            style={[styles.sectionSwitchBtn, activeSection === 'vocab' && styles.sectionSwitchBtnActive]}
            onPress={() => setActiveSection('vocab')}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color={activeSection === 'vocab' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.sectionSwitchText, activeSection === 'vocab' && styles.sectionSwitchTextActive]}>
              {language === 'mr' ? 'शब्दसंग्रह (Vocab)' : 'Vocabulary'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionSwitchBtn, activeSection === 'verbs' && styles.sectionSwitchBtnActive]}
            onPress={() => setActiveSection('verbs')}
            activeOpacity={0.8}
          >
            <Zap size={16} color={activeSection === 'verbs' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.sectionSwitchText, activeSection === 'verbs' && styles.sectionSwitchTextActive]}>
              {language === 'mr' ? 'क्रियापदे (V1, V2, V3)' : 'Verb Forms'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= SECTION 1: VOCABULARY ================= */}
        {activeSection === 'vocab' && (
          <View>
            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, isActive && styles.catPillActive]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Search Bar & View Mode Toggle */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputWrap}>
                <Search size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={language === 'mr' ? 'शब्द किंवा अर्थ शोधा...' : 'Search words...'}
                  placeholderTextColor={COLORS.textLight}
                  value={vocabSearch}
                  onChangeText={setVocabSearch}
                />
                {vocabSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setVocabSearch('')}>
                    <X size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.viewModeBtn, viewMode === 'flashcards' && styles.viewModeBtnActive]}
                onPress={() => {
                  setViewMode(viewMode === 'grid' ? 'flashcards' : 'grid');
                  setFlashcardIdx(0);
                  setIsFlipped(false);
                }}
              >
                <Layers size={18} color={viewMode === 'flashcards' ? COLORS.white : COLORS.secondary} />
              </TouchableOpacity>
            </View>

            {/* Flashcard Mode */}
            {viewMode === 'flashcards' && filteredVocab.length > 0 && (
              <View style={styles.fcContainer}>
                {(() => {
                  const card = filteredVocab[flashcardIdx] || filteredVocab[0];
                  return (
                    <View style={styles.fcCenterCol}>
                      <TouchableOpacity
                        style={styles.fcBigCard}
                        onPress={() => setIsFlipped(!isFlipped)}
                        activeOpacity={0.9}
                      >
                        {!isFlipped ? (
                          <View style={styles.fcContentCenter}>
                            <Text style={styles.fcTapHint}>
                              {language === 'mr' ? '👆 अर्थ पाहण्यासाठी टॅप करा' : '👆 Tap to flip'}
                            </Text>
                            <Text style={styles.fcWordEn}>{card.word}</Text>
                            <Text style={styles.fcWordPron}>({card.pronunciation || ''})</Text>
                            <AudioButton text={card.word} size={46} />
                          </View>
                        ) : (
                          <View style={[styles.fcContentCenter, styles.fcContentBack]}>
                            <Text style={styles.fcTapHint}>
                              {language === 'mr' ? 'मराठी / हिंदी अर्थ' : 'Meaning'}
                            </Text>
                            <Text style={styles.fcWordMeaning}>
                              {language === 'mr' ? card.marathi : card.hindi || card.marathi}
                            </Text>
                            {card.example && (
                              <Text style={styles.fcExample}>"{card.example}"</Text>
                            )}
                          </View>
                        )}
                      </TouchableOpacity>

                      <View style={styles.fcControlRow}>
                        <TouchableOpacity
                          style={[styles.fcNavBtn, flashcardIdx === 0 && styles.fcNavBtnDisabled]}
                          disabled={flashcardIdx === 0}
                          onPress={() => {
                            setFlashcardIdx(prev => Math.max(0, prev - 1));
                            setIsFlipped(false);
                          }}
                        >
                          <ArrowLeft size={18} color={COLORS.secondary} />
                          <Text style={styles.fcNavBtnText}>{language === 'mr' ? 'मागे' : 'Prev'}</Text>
                        </TouchableOpacity>

                        <Text style={styles.fcCountText}>
                          {flashcardIdx + 1} / {filteredVocab.length}
                        </Text>

                        <TouchableOpacity
                          style={[styles.fcNavBtn, flashcardIdx >= filteredVocab.length - 1 && styles.fcNavBtnDisabled]}
                          disabled={flashcardIdx >= filteredVocab.length - 1}
                          onPress={() => {
                            setFlashcardIdx(prev => Math.min(filteredVocab.length - 1, prev + 1));
                            setIsFlipped(false);
                          }}
                        >
                          <Text style={styles.fcNavBtnText}>{language === 'mr' ? 'पुढे' : 'Next'}</Text>
                          <ArrowRight size={18} color={COLORS.secondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* Grid Word Cards Mode */}
            {viewMode === 'grid' && (
              <View style={styles.cardsGrid}>
                {filteredVocab.map((w, idx) => {
                  const isFav = favoriteIds.includes(w.id);
                  return (
                    <View key={w.id || idx} style={styles.wordCard}>
                      <View style={styles.wordCardHeader}>
                        <View style={styles.wordEnCol}>
                          <Text style={styles.cardEnWord}>{w.word}</Text>
                          <Text style={styles.cardPron}>({w.pronunciation || ''})</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.favBtn}
                          onPress={() => toggleFavorite(w.id)}
                          activeOpacity={0.7}
                        >
                          <Heart
                            size={18}
                            color={isFav ? '#EF4444' : COLORS.textLight}
                            fill={isFav ? '#EF4444' : 'transparent'}
                          />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.cardMeaning}>
                        {language === 'mr' ? w.marathi : language === 'hi' ? w.hindi : w.marathi}
                      </Text>

                      <View style={styles.wordCardFooter}>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>{w.type || 'noun'}</Text>
                        </View>
                        <AudioButton text={w.word} size={36} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ================= SECTION 2: VERBS (V1, V2, V3) ================= */}
        {activeSection === 'verbs' && (
          <View>
            {/* Verb Search Bar */}
            <View style={styles.searchBarWrap}>
              <Search size={16} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={language === 'mr' ? 'क्रियापद शोधा (उदा: go, speak)...' : 'Search verbs...'}
                placeholderTextColor={COLORS.textLight}
                value={verbSearch}
                onChangeText={setVerbSearch}
              />
              {verbSearch.length > 0 && (
                <TouchableOpacity onPress={() => setVerbSearch('')}>
                  <X size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Verbs List */}
            <View style={styles.verbsList}>
              {filteredVerbs.map((vb, idx) => (
                <View key={vb.id || idx} style={styles.verbCard}>
                  <View style={styles.verbHeaderRow}>
                    <View style={styles.verbNumBadge}>
                      <Text style={styles.verbNumText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.verbTitleCol}>
                      <Text style={styles.verbMeaningText}>
                        {language === 'mr' ? vb.marathi : language === 'hi' ? vb.hindi : vb.marathi}
                      </Text>
                      {vb.type && <Text style={styles.verbTypeHint}>{vb.type}</Text>}
                    </View>
                    <AudioButton text={`${vb.v1}, ${vb.v2}, ${vb.v3}`} size={36} />
                  </View>

                  {/* V1, V2, V3 Grid Pills */}
                  <View style={styles.vFormsRow}>
                    <View style={[styles.vFormCol, { backgroundColor: COLORS.primaryLight }]}>
                      <Text style={styles.vFormLabel}>V1 (Base)</Text>
                      <Text style={[styles.vFormWord, { color: COLORS.primaryDark }]}>{vb.v1}</Text>
                    </View>

                    <View style={[styles.vFormCol, { backgroundColor: COLORS.secondaryLight }]}>
                      <Text style={styles.vFormLabel}>V2 (Past)</Text>
                      <Text style={[styles.vFormWord, { color: COLORS.secondary }]}>{vb.v2}</Text>
                    </View>

                    <View style={[styles.vFormCol, { backgroundColor: COLORS.accentGreenLight }]}>
                      <Text style={styles.vFormLabel}>V3 (Participle)</Text>
                      <Text style={[styles.vFormWord, { color: COLORS.accentGreenDark }]}>{vb.v3}</Text>
                    </View>
                  </View>

                  {vb.example && (
                    <View style={styles.verbExampleBox}>
                      <Text style={styles.verbExLabel}>{language === 'mr' ? 'वाक्यात उपयोग:' : 'Example:'}</Text>
                      <Text style={styles.verbExText}>{vb.example}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
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
  headerBlock: {
    marginBottom: SPACING.md,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
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
  sectionSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.md,
    gap: 4,
  },
  sectionSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  sectionSwitchBtnActive: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.sm,
  },
  sectionSwitchText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  sectionSwitchTextActive: {
    color: COLORS.white,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  catPillTextActive: {
    color: COLORS.white,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    ...SHADOWS.sm,
  },
  searchBarWrap: {
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
  viewModeBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  viewModeBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  wordCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  wordCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  wordEnCol: {
    flex: 1,
  },
  cardEnWord: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  cardPron: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  favBtn: {
    padding: 4,
  },
  cardMeaning: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
    minHeight: 18,
  },
  wordCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  fcContainer: {
    paddingVertical: 10,
  },
  fcCenterCol: {
    alignItems: 'center',
    gap: 14,
  },
  fcBigCard: {
    width: '100%',
    minHeight: 220,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderAmber,
    ...SHADOWS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fcContentCenter: {
    alignItems: 'center',
    gap: 8,
  },
  fcContentBack: {
    backgroundColor: COLORS.secondaryLight,
    width: '100%',
    padding: 16,
    borderRadius: RADIUS.md,
  },
  fcTapHint: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  fcWordEn: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  fcWordPron: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  fcWordMeaning: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  fcExample: {
    fontSize: 13,
    color: COLORS.textMain,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  fcControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  fcNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fcNavBtnDisabled: {
    opacity: 0.4,
  },
  fcNavBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  fcCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  verbsList: {
    gap: 10,
  },
  verbCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  verbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  verbNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verbNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  verbTitleCol: {
    flex: 1,
  },
  verbMeaningText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  verbTypeHint: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  vFormsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  vFormCol: {
    flex: 1,
    padding: 8,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  vFormLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  vFormWord: {
    fontSize: 13,
    fontWeight: '900',
  },
  verbExampleBox: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    flexDirection: 'row',
    gap: 4,
  },
  verbExLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  verbExText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
});
