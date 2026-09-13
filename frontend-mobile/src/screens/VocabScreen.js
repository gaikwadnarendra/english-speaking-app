import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
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
  ChevronDown,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_VOCAB, INITIAL_VERBS } from '../data/vocabData';
import { api } from '../config/api';

const FAVORITES_STORAGE_KEY = '@english_shika_fav_words';
const VOCAB_CACHE_KEY = '@english_shika_vocab_cache';
const VERBS_CACHE_KEY = '@english_shika_verbs_cache';
const PAGE_SIZE = 25;

export default function VocabScreen() {
  const { t, language, speechRate } = useApp();
  const { completeTask } = useProgress();

  // Mode: 'vocab' vs 'verbs'
  const [activeSection, setActiveSection] = useState('vocab');

  // Master Data - start immediately with instant bundled dataset
  const [vocabList, setVocabList] = useState(INITIAL_VOCAB);
  const [verbsList, setVerbsList] = useState(INITIAL_VERBS);
  const [favoriteIds, setFavoriteIds] = useState([1, 2, 3, 5]);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination / Batch Limit for high 60 FPS performance
  const [vocabDisplayLimit, setVocabDisplayLimit] = useState(PAGE_SIZE);
  const [verbDisplayLimit, setVerbDisplayLimit] = useState(PAGE_SIZE);

  // Vocab Filters
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'flashcards'
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);

  // Verbs Filters
  const [verbSearch, setVerbSearch] = useState('');

  // Load from offline AsyncStorage cache first on mount, then background sync
  useEffect(() => {
    const loadCache = async () => {
      try {
        const [storedFavs, storedVocab, storedVerbs] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
          AsyncStorage.getItem(VOCAB_CACHE_KEY),
          AsyncStorage.getItem(VERBS_CACHE_KEY)
        ]);
        if (storedFavs) setFavoriteIds(JSON.parse(storedFavs));
        if (storedVocab) {
          const parsed = JSON.parse(storedVocab);
          if (Array.isArray(parsed) && parsed.length > 0) setVocabList(parsed);
        }
        if (storedVerbs) {
          const parsedV = JSON.parse(storedVerbs);
          if (Array.isArray(parsedV) && parsedV.length > 0) setVerbsList(parsedV);
        }
      } catch (e) {
        console.warn('Cache load notice:', e);
      }
    };
    loadCache();
    fetchData();
  }, []);

  // Background non-blocking fetch from backend API
  const fetchData = async () => {
    try {
      const [vocabRes, verbsRes] = await Promise.allSettled([
        api.get('/vocab', { timeout: 8000 }),
        api.get('/verbs', { timeout: 8000 }),
      ]);

      if (vocabRes.status === 'fulfilled' && vocabRes.value.data?.data?.length > 0) {
        const data = vocabRes.value.data.data;
        setVocabList(data);
        AsyncStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(data)).catch(() => {});
      }
      if (verbsRes.status === 'fulfilled' && verbsRes.value.data?.data?.length > 0) {
        const vData = verbsRes.value.data.data;
        setVerbsList(vData);
        AsyncStorage.setItem(VERBS_CACHE_KEY, JSON.stringify(vData)).catch(() => {});
      }
    } catch (err) {
      // Keep running smoothly on instant cached/bundled data
    } finally {
      setRefreshing(false);
    }
  };

  const toggleFavorite = async (id) => {
    const isFav = favoriteIds.includes(id);
    const updated = isFav ? favoriteIds.filter(fId => fId !== id) : [...favoriteIds, id];
    setFavoriteIds(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Extract categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    vocabList.forEach(v => {
      if (v.category) cats.add(v.category);
    });
    return Array.from(cats);
  }, [vocabList]);

  const levels = ['All', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

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

      const matchesLevel =
        selectedLevel === 'All' ||
        w.level === parseInt(selectedLevel.replace('Level ', ''), 10);

      const matchesFav = !showOnlyFavs || favoriteIds.includes(w.id);

      return matchesSearch && matchesCategory && matchesLevel && matchesFav;
    });
  }, [vocabList, vocabSearch, selectedCategory, selectedLevel, showOnlyFavs, favoriteIds]);

  // Paginated Vocab for instant 60 FPS render
  const visibleVocab = useMemo(() => {
    return filteredVocab.slice(0, vocabDisplayLimit);
  }, [filteredVocab, vocabDisplayLimit]);

  // Filtered Verbs
  const filteredVerbs = useMemo(() => {
    return verbsList.filter(vb => {
      const q = verbSearch.trim().toLowerCase();
      return (
        !q ||
        (vb.english && vb.english.toLowerCase().includes(q)) ||
        (vb.v1 && vb.v1.toLowerCase().includes(q)) ||
        (vb.v2 && vb.v2.toLowerCase().includes(q)) ||
        (vb.v3 && vb.v3.toLowerCase().includes(q)) ||
        (vb.marathi && vb.marathi.includes(q)) ||
        (vb.hindi && vb.hindi.includes(q))
      );
    });
  }, [verbsList, verbSearch]);

  const visibleVerbs = useMemo(() => {
    return filteredVerbs.slice(0, verbDisplayLimit);
  }, [filteredVerbs, verbDisplayLimit]);

  const handleCardNext = () => {
    const nextIdx = Math.min(filteredVocab.length - 1, flashcardIdx + 1);
    setFlashcardIdx(nextIdx);
    setIsFlipped(false);
    const newCount = studiedCount + 1;
    setStudiedCount(newCount);

    if (newCount >= 10) completeTask(1, 'vocab_l1');
    if (newCount >= 25) completeTask(3, 'vocab_advanced');
    if (newCount >= 50) completeTask(5, 'vocab_master');
  };

  // Pull-to-refresh: re-fetch from API and update cache
  const onRefresh = () => {
    setRefreshing(true);
    setVocabDisplayLimit(PAGE_SIZE);
    setVerbDisplayLimit(PAGE_SIZE);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.badgePill}>
            <Sparkles size={13} color={COLORS.secondary} />
            <Text style={styles.badgePillText}>{language === 'mr' ? 'शब्दभांडार' : 'Word Bank'}</Text>
          </View>
          <Text style={styles.mainTitle}>{language === 'mr' ? 'शब्दावली व क्रियापदे' : 'Vocabulary & Verbs'}</Text>
          <Text style={styles.mainSub}>
            {language === 'mr'
              ? `एकूण ${vocabList.length}+ शब्द आणि ${verbsList.length}+ क्रियापद रूपे उपलब्ध आहेत.`
              : `Explore ${vocabList.length}+ vocabulary words and ${verbsList.length}+ verb forms.`}
          </Text>
        </View>

        {/* Section Switcher (Vocabulary vs Verbs) */}
        <View style={styles.sectionSwitchRow}>
          <TouchableOpacity
            style={[styles.sectionSwitchBtn, activeSection === 'vocab' && styles.sectionSwitchBtnActive]}
            onPress={() => {
              setActiveSection('vocab');
              setVocabDisplayLimit(PAGE_SIZE);
            }}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color={activeSection === 'vocab' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.sectionSwitchText, activeSection === 'vocab' && styles.sectionSwitchTextActive]}>
              {language === 'mr' ? `शब्दसंग्रह (${vocabList.length})` : `Vocabulary (${vocabList.length})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionSwitchBtn, activeSection === 'verbs' && styles.sectionSwitchBtnActive]}
            onPress={() => {
              setActiveSection('verbs');
              setVerbDisplayLimit(PAGE_SIZE);
            }}
            activeOpacity={0.8}
          >
            <Zap size={16} color={activeSection === 'verbs' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.sectionSwitchText, activeSection === 'verbs' && styles.sectionSwitchTextActive]}>
              {language === 'mr' ? `क्रियापदे (${verbsList.length})` : `Verbs (${verbsList.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= SECTION 1: VOCABULARY ================= */}
        {activeSection === 'vocab' && (
          <View>
            {/* Level Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {levels.map(lvl => {
                const isActive = selectedLevel === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.levelPill, isActive && styles.levelPillActive]}
                    onPress={() => {
                      setSelectedLevel(lvl);
                      setVocabDisplayLimit(PAGE_SIZE);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.levelPillText, isActive && styles.levelPillTextActive]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, isActive && styles.catPillActive]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setVocabDisplayLimit(PAGE_SIZE);
                    }}
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
                  onChangeText={(text) => {
                    setVocabSearch(text);
                    setVocabDisplayLimit(PAGE_SIZE);
                  }}
                />
                {vocabSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setVocabSearch('')}>
                    <X size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Favorites toggle */}
              <TouchableOpacity
                style={[styles.favFilterBtn, showOnlyFavs && styles.favFilterBtnActive]}
                onPress={() => setShowOnlyFavs(!showOnlyFavs)}
                activeOpacity={0.7}
              >
                <Heart
                  size={18}
                  color={showOnlyFavs ? '#EF4444' : COLORS.textMuted}
                  fill={showOnlyFavs ? '#EF4444' : 'transparent'}
                />
              </TouchableOpacity>

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
                            <View style={{ marginTop: 12 }}>
                              <AudioButton text={card.word} size={46} />
                            </View>
                          </View>
                        ) : (
                          <View style={[styles.fcContentCenter, styles.fcContentBack]}>
                            <Text style={styles.fcTapHint}>
                              {language === 'mr' ? 'मराठी / हिंदी अर्थ' : 'Meaning'}
                            </Text>
                            <Text style={styles.fcWordMeaning}>
                              {language === 'mr' ? card.marathi : card.hindi || card.marathi}
                            </Text>
                            {card.examples && card.examples.length > 0 && (
                              <Text style={styles.fcExample}>
                                "{card.examples[0].english || card.examples[0]}"
                              </Text>
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
                          onPress={handleCardNext}
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

            {/* Grid Word Cards Mode with Virtualized Paging */}
            {viewMode === 'grid' && (
              <View>
                <View style={styles.cardsGrid}>
                  {filteredVocab.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <Text style={styles.emptyText}>कोणतेही शब्द सापडले नाहीत.</Text>
                    </View>
                  ) : (
                    visibleVocab.map((w, idx) => {
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
                            <AudioButton text={w.word} size={34} />
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>

                {/* Load More Button */}
                {visibleVocab.length < filteredVocab.length && (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={() => setVocabDisplayLimit(prev => prev + PAGE_SIZE)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.loadMoreBtnText}>
                      {language === 'mr'
                        ? `आणखी शब्द दाखवा (${visibleVocab.length} / ${filteredVocab.length})`
                        : `Load More Words (${visibleVocab.length} / ${filteredVocab.length})`}
                    </Text>
                    <ChevronDown size={16} color={COLORS.secondary} />
                  </TouchableOpacity>
                )}
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
                onChangeText={(text) => {
                  setVerbSearch(text);
                  setVerbDisplayLimit(PAGE_SIZE);
                }}
              />
              {verbSearch.length > 0 && (
                <TouchableOpacity onPress={() => setVerbSearch('')}>
                  <X size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Verbs List with Virtualized Paging */}
            <View style={styles.verbsList}>
              {visibleVerbs.map((vb, idx) => (
                <View key={vb.id || idx} style={styles.verbCard}>
                  <View style={styles.verbHeaderRow}>
                    <View style={styles.verbNumBadge}>
                      <Text style={styles.verbNumText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.verbTitleCol}>
                      <Text style={styles.verbMeaningText}>
                        {language === 'mr' ? vb.marathi : language === 'hi' ? vb.hindi : vb.marathi}
                      </Text>
                      <Text style={styles.verbPronText}>({vb.pronunciation || vb.pron || ''})</Text>
                    </View>
                    <AudioButton text={`${vb.v1}, ${vb.v2}, ${vb.v3}`} size={36} />
                  </View>

                  {/* V1, V2, V3 Grid Pills */}
                  <View style={styles.verbFormsRow}>
                    <View style={styles.verbFormCol}>
                      <Text style={styles.vLabel}>V1 (Base)</Text>
                      <Text style={styles.vValue}>{vb.v1}</Text>
                    </View>
                    <View style={styles.verbFormCol}>
                      <Text style={styles.vLabel}>V2 (Past)</Text>
                      <Text style={styles.vValue}>{vb.v2}</Text>
                    </View>
                    <View style={styles.verbFormCol}>
                      <Text style={styles.vLabel}>V3 (Participle)</Text>
                      <Text style={styles.vValue}>{vb.v3}</Text>
                    </View>
                  </View>

                  {vb.example_en && (
                    <View style={styles.verbExBox}>
                      <Text style={styles.verbExEn}>💬 {vb.example_en}</Text>
                      <Text style={styles.verbExMr}>
                        {language === 'mr' ? vb.example_mr : vb.example_hi || vb.example_mr}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Load More Verbs Button */}
              {visibleVerbs.length < filteredVerbs.length && (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={() => setVerbDisplayLimit(prev => prev + PAGE_SIZE)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loadMoreBtnText}>
                    {language === 'mr'
                      ? `आणखी क्रियापदे दाखवा (${visibleVerbs.length} / ${filteredVerbs.length})`
                      : `Load More Verbs (${visibleVerbs.length} / ${filteredVerbs.length})`}
                  </Text>
                  <ChevronDown size={16} color={COLORS.secondary} />
                </TouchableOpacity>
              )}
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBlock: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  mainSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  sectionSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.lg,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  sectionSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  sectionSwitchBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  sectionSwitchText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  sectionSwitchTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
    marginBottom: 8,
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    marginRight: 6,
  },
  levelPillActive: {
    backgroundColor: COLORS.primary,
  },
  levelPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  levelPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  catScroll: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  catPillTextActive: {
    color: COLORS.white,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  favFilterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  favFilterBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  viewModeBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  viewModeBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  fcContainer: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  fcCenterCol: {
    alignItems: 'center',
  },
  fcBigCard: {
    width: '100%',
    minHeight: 220,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E7FF',
    ...SHADOWS.md,
  },
  fcContentCenter: {
    alignItems: 'center',
  },
  fcContentBack: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
  },
  fcTapHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 12,
    fontWeight: '500',
  },
  fcWordEn: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  fcWordPron: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  fcWordMeaning: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  fcExample: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  fcControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.lg,
  },
  fcNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  fcNavBtnDisabled: {
    opacity: 0.4,
  },
  fcNavBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  fcCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: 12,
  },
  wordCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  wordCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  wordEnCol: {
    flex: 1,
  },
  cardEnWord: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardPron: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  favBtn: {
    padding: 2,
  },
  cardMeaning: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  wordCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    gap: 6,
  },
  loadMoreBtnText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  verbsList: {
    paddingHorizontal: SPACING.lg,
    gap: 12,
  },
  verbCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  verbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  verbNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verbNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  verbTitleCol: {
    flex: 1,
  },
  verbMeaningText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  verbPronText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  verbFormsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 8,
    justifyContent: 'space-between',
  },
  verbFormCol: {
    flex: 1,
    alignItems: 'center',
  },
  vLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  vValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  verbExBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  verbExEn: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  verbExMr: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emptyBox: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  }
});
