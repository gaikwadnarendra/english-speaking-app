import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import {
  Sparkles,
  Search,
  BookMarked,
  Heart,
  LayoutGrid,
  Layers,
  Zap,
  Table as TableIcon,
  HelpCircle,
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

  // Top Section: 'vocab' vs 'verbs'
  const [activeSection, setActiveSection] = useState('vocab'); // 'vocab' | 'verbs'

  // Master Data
  const [vocabList, setVocabList] = useState(INITIAL_VOCAB);
  const [verbsList, setVerbsList] = useState(INITIAL_VERBS);
  const [favoriteIds, setFavoriteIds] = useState([3, 4, 7, 14, 15, 18]);

  // Vocab Filters
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [vocabMode, setVocabMode] = useState('grid'); // 'grid' | 'flashcards'
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Verbs Filters
  const [verbSearch, setVerbSearch] = useState('');
  const [verbTypeFilter, setVerbTypeFilter] = useState('all'); // 'all' | 'regular' | 'irregular'
  const [verbMode, setVerbMode] = useState('cards'); // 'cards' | 'table' | 'quiz'

  // Verb Quiz Drill
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          setFavoriteIds(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  // Fetch online updates if available
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [vRes, vbRes] = await Promise.allSettled([
          api.get('/api/vocab'),
          api.get('/api/verbs'),
        ]);
        if (vRes.status === 'fulfilled' && vRes.value.data?.data) {
          setVocabList(vRes.value.data.data);
        }
        if (vbRes.status === 'fulfilled' && vbRes.value.data?.data) {
          setVerbsList(vbRes.value.data.data);
        }
      } catch (e) {}
    };
    fetchApiData();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (id) => {
    let updated;
    if (favoriteIds.includes(id)) {
      updated = favoriteIds.filter(favId => favId !== id);
    } else {
      updated = [...favoriteIds, id];
    }
    setFavoriteIds(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    vocabList.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [vocabList]);

  // Filtered Vocabulary
  const filteredVocab = useMemo(() => {
    return vocabList.filter(item => {
      const q = vocabSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        (item.word && item.word.toLowerCase().includes(q)) ||
        (item.marathi && item.marathi.includes(q)) ||
        (item.hindi && item.hindi.includes(q)) ||
        (item.pronunciation && item.pronunciation.includes(q));

      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || item.level === parseInt(selectedLevel, 10);
      const matchFav = !onlyFavorites || favoriteIds.includes(item.id);

      return matchSearch && matchCat && matchLevel && matchFav;
    });
  }, [vocabList, vocabSearch, selectedCategory, selectedLevel, onlyFavorites, favoriteIds]);

  // Filtered Verbs
  const filteredVerbs = useMemo(() => {
    return verbsList.filter(item => {
      const q = verbSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        (item.english && item.english.toLowerCase().includes(q)) ||
        (item.marathi && item.marathi.includes(q)) ||
        (item.hindi && item.hindi.includes(q)) ||
        (item.v1 && item.v1.toLowerCase().includes(q)) ||
        (item.v2 && item.v2.toLowerCase().includes(q)) ||
        (item.v3 && item.v3.toLowerCase().includes(q));

      const matchType =
        verbTypeFilter === 'all' ||
        (verbTypeFilter === 'regular' && !item.is_irregular) ||
        (verbTypeFilter === 'irregular' && item.is_irregular);

      return matchSearch && matchType;
    });
  }, [verbsList, verbSearch, verbTypeFilter]);

  // Verb Quiz List
  const currentQuizVerb = filteredVerbs[quizIdx] || filteredVerbs[0] || {};
  const quizOptions = useMemo(() => {
    if (!currentQuizVerb || !currentQuizVerb.v2) return [];
    const correct = currentQuizVerb.v2;
    const pool = verbsList.map(v => v.v2).filter(v => v !== correct);
    const shuffledPool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledPool].sort(() => 0.5 - Math.random());
  }, [currentQuizVerb, verbsList]);

  return (
    <View style={styles.container}>
      <Header />

      {/* Top Segmented Navigation: Vocab vs Verbs */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSection === 'vocab' && styles.segmentBtnActive]}
          onPress={() => setActiveSection('vocab')}
          activeOpacity={0.8}
        >
          <BookMarked
            size={17}
            color={activeSection === 'vocab' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              activeSection === 'vocab' && styles.segmentTextActive,
            ]}
          >
            {language === 'mr' ? 'शब्दसंग्रह (Vocab)' : language === 'hi' ? 'शब्दावली (Vocab)' : 'Vocabulary'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSection === 'verbs' && styles.segmentBtnActive]}
          onPress={() => setActiveSection('verbs')}
          activeOpacity={0.8}
        >
          <Zap
            size={17}
            color={activeSection === 'verbs' ? COLORS.secondary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              activeSection === 'verbs' && { color: COLORS.secondary, fontWeight: '800' },
            ]}
          >
            {language === 'mr' ? 'क्रियापदे (V1-V2-V3)' : language === 'hi' ? 'क्रिया रूप (V1-V2-V3)' : 'Verbs & Forms'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= SECTION 1: VOCABULARY ================= */}
      {activeSection === 'vocab' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar & View Mode */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  language === 'mr'
                    ? 'शब्द, अर्थ किंवा उच्चार शोधा...'
                    : language === 'hi'
                    ? 'शब्द, अर्थ या उच्चारण खोजें...'
                    : 'Search words, meanings...'
                }
                placeholderTextColor={COLORS.textMuted}
                value={vocabSearch}
                onChangeText={setVocabSearch}
              />
              {vocabSearch.length > 0 && (
                <TouchableOpacity onPress={() => setVocabSearch('')}>
                  <X size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Grid / Flashcard Switcher */}
            <View style={styles.modeToggleWrap}>
              <TouchableOpacity
                style={[styles.modeBtn, vocabMode === 'grid' && styles.modeBtnActive]}
                onPress={() => setVocabMode('grid')}
              >
                <LayoutGrid size={16} color={vocabMode === 'grid' ? COLORS.primary : COLORS.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, vocabMode === 'flashcards' && styles.modeBtnActive]}
                onPress={() => {
                  setVocabMode('flashcards');
                  setFlashcardIdx(0);
                  setIsFlipped(false);
                }}
              >
                <Layers size={16} color={vocabMode === 'flashcards' ? COLORS.primary : COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <TouchableOpacity
              style={[styles.favFilterChip, onlyFavorites && styles.favFilterChipActive]}
              onPress={() => setOnlyFavorites(!onlyFavorites)}
            >
              <Heart
                size={14}
                color={onlyFavorites ? COLORS.white : '#EF4444'}
                fill={onlyFavorites ? COLORS.white : '#EF4444'}
              />
              <Text style={[styles.favFilterText, onlyFavorites && styles.favFilterTextActive]}>
                {language === 'mr' ? 'सेव्ह केलेले' : language === 'hi' ? 'पसंदीदा' : 'Favorites'}
              </Text>
            </TouchableOpacity>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat === 'All' ? (language === 'mr' ? 'सर्व शब्द' : language === 'hi' ? 'सभी शब्द' : 'All') : cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Results Summary Count */}
          <View style={styles.resultsCountRow}>
            <Text style={styles.resultsCountText}>
              {filteredVocab.length} {language === 'mr' ? 'शब्द उपलब्ध' : 'words found'}
            </Text>
          </View>

          {/* GRID MODE */}
          {vocabMode === 'grid' && (
            <View style={styles.vocabGrid}>
              {filteredVocab.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    {language === 'mr' ? 'कोणताही शब्द सापडला नाही.' : 'No words found.'}
                  </Text>
                </View>
              ) : (
                filteredVocab.map(item => {
                  const isFav = favoriteIds.includes(item.id);
                  return (
                    <View key={item.id} style={styles.wordCard}>
                      <View style={styles.wordCardTop}>
                        <View style={styles.wordTitleWrap}>
                          <Text style={styles.wordTitle}>{item.word}</Text>
                          <Text style={styles.wordPron}>/{item.pronunciation}/</Text>
                        </View>
                        <View style={styles.wordCardActions}>
                          <AudioButton text={item.word} size={34} />
                          <TouchableOpacity
                            onPress={() => toggleFavorite(item.id)}
                            style={styles.favBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Heart
                              size={18}
                              color={isFav ? '#EF4444' : COLORS.textMuted}
                              fill={isFav ? '#EF4444' : 'transparent'}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.wordTagRow}>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>{item.type || 'noun'}</Text>
                        </View>
                        <Text style={styles.categoryBadgeText}>{item.category}</Text>
                      </View>

                      {/* Meanings */}
                      <View style={styles.meaningRow}>
                        <Text style={styles.meaningLabel}>मराठी:</Text>
                        <Text style={styles.meaningVal}>{item.marathi}</Text>
                      </View>
                      {item.hindi && (
                        <View style={styles.meaningRow}>
                          <Text style={styles.meaningLabel}>हिंदी:</Text>
                          <Text style={styles.meaningVal}>{item.hindi}</Text>
                        </View>
                      )}

                      {/* Example */}
                      {item.examples && item.examples.length > 0 && (
                        <View style={styles.exampleBox}>
                          <View style={styles.exampleEnRow}>
                            <Text style={styles.exampleEn}>"{item.examples[0].english}"</Text>
                            <AudioButton text={item.examples[0].english} size={26} />
                          </View>
                          <Text style={styles.exampleLoc}>
                            {language === 'hi' && item.examples[0].hindi
                              ? item.examples[0].hindi
                              : item.examples[0].marathi}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* FLASHCARD MODE */}
          {vocabMode === 'flashcards' && filteredVocab.length > 0 && (
            <View style={styles.flashcardWrap}>
              <View style={styles.fcMetaRow}>
                <Text style={styles.fcIndex}>
                  {flashcardIdx + 1} / {filteredVocab.length}
                </Text>
                <Text style={styles.fcHint}>
                  {language === 'mr' ? 'कार्डवर टॅप करून उलटा ↺' : 'Tap to Flip ↺'}
                </Text>
              </View>

              {(() => {
                const cur = filteredVocab[flashcardIdx] || {};
                return (
                  <TouchableOpacity
                    style={[styles.fcBigCard, isFlipped ? styles.fcBigBack : styles.fcBigFront]}
                    onPress={() => setIsFlipped(!isFlipped)}
                    activeOpacity={0.92}
                  >
                    {!isFlipped ? (
                      <View style={styles.fcInner}>
                        <Text style={styles.fcTypeBadge}>{cur.type || 'Word'}</Text>
                        <Text style={styles.fcMainWord}>{cur.word}</Text>
                        <Text style={styles.fcMainPron}>/{cur.pronunciation}/</Text>
                        <View style={{ marginTop: 16 }}>
                          <AudioButton text={cur.word} size={48} />
                        </View>
                        <Text style={styles.fcTapInstruction}>
                          {language === 'mr' ? 'अर्थ पाहण्यासाठी टॅप करा ↺' : 'Tap for Meaning ↺'}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.fcInner}>
                        <Text style={[styles.fcTypeBadge, { color: COLORS.secondary }]}>
                          Meaning & Example
                        </Text>
                        <Text style={styles.fcMeaningMr}>मराठी: {cur.marathi}</Text>
                        {cur.hindi && <Text style={styles.fcMeaningHi}>हिंदी: {cur.hindi}</Text>}
                        {cur.examples && cur.examples[0] && (
                          <View style={styles.fcExWrap}>
                            <Text style={styles.fcExEn}>"{cur.examples[0].english}"</Text>
                            <Text style={styles.fcExLoc}>
                              {language === 'hi' && cur.examples[0].hindi
                                ? cur.examples[0].hindi
                                : cur.examples[0].marathi}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })()}

              <View style={styles.fcNavControls}>
                <TouchableOpacity
                  style={[styles.fcNavBtn, flashcardIdx === 0 && styles.fcNavBtnDisabled]}
                  disabled={flashcardIdx === 0}
                  onPress={() => {
                    setIsFlipped(false);
                    setFlashcardIdx(prev => Math.max(0, prev - 1));
                  }}
                >
                  <ArrowLeft size={18} color={flashcardIdx === 0 ? COLORS.textMuted : COLORS.primary} />
                  <Text style={[styles.fcNavBtnText, flashcardIdx === 0 && { color: COLORS.textMuted }]}>
                    {language === 'mr' ? 'मागे' : 'Prev'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fcNavBtn, styles.fcNavFlipBtn]}
                  onPress={() => setIsFlipped(!isFlipped)}
                >
                  <RotateCcw size={18} color={COLORS.white} />
                  <Text style={[styles.fcNavBtnText, { color: COLORS.white }]}>
                    {language === 'mr' ? 'उलटा' : 'Flip'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fcNavBtn, flashcardIdx === filteredVocab.length - 1 && styles.fcNavBtnDisabled]}
                  disabled={flashcardIdx === filteredVocab.length - 1}
                  onPress={() => {
                    setIsFlipped(false);
                    setFlashcardIdx(prev => Math.min(filteredVocab.length - 1, prev + 1));
                  }}
                >
                  <Text
                    style={[
                      styles.fcNavBtnText,
                      flashcardIdx === filteredVocab.length - 1 && { color: COLORS.textMuted },
                    ]}
                  >
                    {language === 'mr' ? 'पुढे' : 'Next'}
                  </Text>
                  <ArrowRight
                    size={18}
                    color={flashcardIdx === filteredVocab.length - 1 ? COLORS.textMuted : COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ================= SECTION 2: VERBS & FORMS (V1-V2-V3) ================= */}
      {activeSection === 'verbs' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Verbs Sub-mode switch: Cards vs Table vs Quiz */}
          <View style={styles.verbModeStrip}>
            <TouchableOpacity
              style={[styles.verbModeBtn, verbMode === 'cards' && styles.verbModeBtnActive]}
              onPress={() => setVerbMode('cards')}
            >
              <LayoutGrid size={15} color={verbMode === 'cards' ? COLORS.white : COLORS.textMuted} />
              <Text style={[styles.verbModeText, verbMode === 'cards' && styles.verbModeTextActive]}>
                {language === 'mr' ? 'कार्ड्स' : 'Cards'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verbModeBtn, verbMode === 'table' && styles.verbModeBtnActive]}
              onPress={() => setVerbMode('table')}
            >
              <TableIcon size={15} color={verbMode === 'table' ? COLORS.white : COLORS.textMuted} />
              <Text style={[styles.verbModeText, verbMode === 'table' && styles.verbModeTextActive]}>
                {language === 'mr' ? 'तक्ता (Table)' : 'Table'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verbModeBtn, verbMode === 'quiz' && styles.verbModeBtnActive]}
              onPress={() => {
                setVerbMode('quiz');
                setQuizIdx(0);
                setSelectedQuizAnswer(null);
                setQuizScore(0);
              }}
            >
              <HelpCircle size={15} color={verbMode === 'quiz' ? COLORS.white : COLORS.textMuted} />
              <Text style={[styles.verbModeText, verbMode === 'quiz' && styles.verbModeTextActive]}>
                {language === 'mr' ? 'सराव क्विझ' : 'Quiz Drill'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search & Regular/Irregular Filters (Cards or Table mode) */}
          {verbMode !== 'quiz' && (
            <>
              <View style={styles.searchBox}>
                <Search size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={
                    language === 'mr'
                      ? 'कोणतेही रूप शोधा (उदा: Go, Went, Gone)...'
                      : 'Search any form (Go, Went, Gone)...'
                  }
                  placeholderTextColor={COLORS.textMuted}
                  value={verbSearch}
                  onChangeText={setVerbSearch}
                />
                {verbSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setVerbSearch('')}>
                    <X size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.verbTypeRow}>
                <TouchableOpacity
                  style={[styles.verbTypeChip, verbTypeFilter === 'all' && styles.verbTypeChipActive]}
                  onPress={() => setVerbTypeFilter('all')}
                >
                  <Text style={[styles.verbTypeChipText, verbTypeFilter === 'all' && styles.verbTypeChipTextActive]}>
                    {language === 'mr' ? 'सर्व क्रियापदे' : 'All Verbs'} ({verbsList.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.verbTypeChip, verbTypeFilter === 'irregular' && styles.verbTypeChipActive]}
                  onPress={() => setVerbTypeFilter('irregular')}
                >
                  <Text style={[styles.verbTypeChipText, verbTypeFilter === 'irregular' && styles.verbTypeChipTextActive]}>
                    ⚡ {language === 'mr' ? 'अनियमित (Irregular)' : 'Irregular'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.verbTypeChip, verbTypeFilter === 'regular' && styles.verbTypeChipActive]}
                  onPress={() => setVerbTypeFilter('regular')}
                >
                  <Text style={[styles.verbTypeChipText, verbTypeFilter === 'regular' && styles.verbTypeChipTextActive]}>
                    {language === 'mr' ? 'नियमित (Regular -ed)' : 'Regular'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* VERBS CARDS VIEW */}
          {verbMode === 'cards' && (
            <View style={styles.verbsList}>
              {filteredVerbs.map(item => (
                <View key={item.id} style={styles.verbCard}>
                  <View style={styles.verbCardHeader}>
                    <View>
                      <Text style={styles.verbEnMain}>{item.english}</Text>
                      <Text style={styles.verbLocMeaning}>
                        {language === 'hi' && item.hindi ? item.hindi : item.marathi} ({item.pronunciation})
                      </Text>
                    </View>
                    <View style={styles.verbBadgeWrap}>
                      <Text
                        style={[
                          styles.verbBadgeText,
                          item.is_irregular ? styles.badgeIrreg : styles.badgeReg,
                        ]}
                      >
                        {item.is_irregular ? 'Irregular' : 'Regular'}
                      </Text>
                    </View>
                  </View>

                  {/* 4 Verb Forms Grid */}
                  <View style={styles.formsGrid}>
                    <View style={styles.formCol}>
                      <Text style={styles.formColLabel}>V1 (Base)</Text>
                      <Text style={styles.formColVal}>{item.v1}</Text>
                      <AudioButton text={item.v1} size={28} />
                    </View>

                    <View style={styles.formCol}>
                      <Text style={styles.formColLabel}>V2 (Past)</Text>
                      <Text style={[styles.formColVal, { color: COLORS.primary }]}>{item.v2}</Text>
                      <AudioButton text={item.v2} size={28} />
                    </View>

                    <View style={styles.formCol}>
                      <Text style={styles.formColLabel}>V3 (Participle)</Text>
                      <Text style={[styles.formColVal, { color: COLORS.secondary }]}>{item.v3}</Text>
                      <AudioButton text={item.v3} size={28} />
                    </View>

                    <View style={styles.formCol}>
                      <Text style={styles.formColLabel}>V-ing</Text>
                      <Text style={styles.formColVal}>{item.ving}</Text>
                      <AudioButton text={item.ving} size={28} />
                    </View>
                  </View>

                  {/* Example */}
                  {item.example_en && (
                    <View style={styles.verbExampleBox}>
                      <View style={styles.exampleEnRow}>
                        <Text style={styles.exampleEn}>"{item.example_en}"</Text>
                        <AudioButton text={item.example_en} size={26} />
                      </View>
                      <Text style={styles.exampleLoc}>
                        {language === 'hi' && item.example_hi ? item.example_hi : item.example_mr}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* VERBS TABLE VIEW */}
          {verbMode === 'table' && (
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>V1 (Base)</Text>
                <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>V2 (Past)</Text>
                <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>V3 (Participle)</Text>
                <Text style={[styles.tableHeadCol, { flex: 1.4 }]}>मराठी अर्थ</Text>
              </View>

              {filteredVerbs.map((v, i) => (
                <View
                  key={v.id}
                  style={[styles.tableDataRow, i % 2 === 1 && { backgroundColor: '#F9FAFB' }]}
                >
                  <View style={[styles.tableCellWrap, { flex: 1.2 }]}>
                    <Text style={styles.tableDataMain}>{v.v1}</Text>
                    <AudioButton text={v.v1} size={22} />
                  </View>
                  <View style={[styles.tableCellWrap, { flex: 1.2 }]}>
                    <Text style={[styles.tableDataMain, { color: COLORS.primary }]}>{v.v2}</Text>
                    <AudioButton text={v.v2} size={22} />
                  </View>
                  <View style={[styles.tableCellWrap, { flex: 1.2 }]}>
                    <Text style={[styles.tableDataMain, { color: COLORS.secondary }]}>{v.v3}</Text>
                    <AudioButton text={v.v3} size={22} />
                  </View>
                  <Text style={[styles.tableDataLoc, { flex: 1.4 }]}>
                    {language === 'hi' && v.hindi ? v.hindi : v.marathi}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* VERBS QUIZ DRILL */}
          {verbMode === 'quiz' && (
            <View style={styles.quizDrillWrap}>
              <View style={styles.quizDrillHeader}>
                <Text style={styles.quizDrillTitle}>
                  {language === 'mr' ? '⚡ क्रियापद रूप सराव प्रश्न' : '⚡ Verb Form Practice Drill'}
                </Text>
                <Text style={styles.quizDrillScore}>
                  {language === 'mr' ? `गुण: ${quizScore}` : `Score: ${quizScore}`}
                </Text>
              </View>

              <View style={styles.quizDrillCard}>
                <Text style={styles.quizDrillPrompt}>
                  {language === 'mr'
                    ? `'${currentQuizVerb.v1}' (${currentQuizVerb.marathi}) चे भूतकाळी रूप (V2 - Past Form) कोणते आहे?`
                    : `What is the Past Tense (V2) form of '${currentQuizVerb.v1}'?`}
                </Text>

                <View style={styles.quizDrillOptions}>
                  {quizOptions.map((opt, oIdx) => {
                    const isSelected = selectedQuizAnswer === opt;
                    const isCorrect = opt === currentQuizVerb.v2;

                    let optStyle = styles.drillOptBtn;
                    let textStyle = styles.drillOptText;

                    if (selectedQuizAnswer) {
                      if (isCorrect) {
                        optStyle = [styles.drillOptBtn, styles.drillCorrect];
                        textStyle = [styles.drillOptText, { color: '#15803D', fontWeight: '800' }];
                      } else if (isSelected) {
                        optStyle = [styles.drillOptBtn, styles.drillWrong];
                        textStyle = [styles.drillOptText, { color: '#B91C1C', fontWeight: '800' }];
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={oIdx}
                        style={optStyle}
                        disabled={selectedQuizAnswer !== null}
                        onPress={() => {
                          setSelectedQuizAnswer(opt);
                          if (opt === currentQuizVerb.v2) {
                            setQuizScore(prev => prev + 10);
                          }
                        }}
                      >
                        <Text style={textStyle}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {selectedQuizAnswer && (
                  <View style={styles.drillFeedback}>
                    <Text style={styles.drillFeedbackText}>
                      {selectedQuizAnswer === currentQuizVerb.v2
                        ? (language === 'mr' ? 'बरोबर उत्तर! 🎉 (+१० गुण)' : 'Correct! 🎉 (+10 XP)')
                        : (language === 'mr' ? `चूक! योग्य रूप: ${currentQuizVerb.v2}` : `Incorrect! Correct is: ${currentQuizVerb.v2}`)}
                    </Text>
                    <Text style={styles.drillFormsSummary}>
                      V1: {currentQuizVerb.v1} ➔ V2: {currentQuizVerb.v2} ➔ V3: {currentQuizVerb.v3}
                    </Text>

                    <TouchableOpacity
                      style={styles.drillNextBtn}
                      onPress={() => {
                        setSelectedQuizAnswer(null);
                        if (quizIdx < filteredVerbs.length - 1) {
                          setQuizIdx(prev => prev + 1);
                        } else {
                          setQuizIdx(0);
                        }
                      }}
                    >
                      <Text style={styles.drillNextBtnText}>
                        {language === 'mr' ? 'पुढील प्रश्न ➔' : 'Next Question ➔'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.s,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  segmentTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.m,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.s,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.m,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  modeToggleWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  modeBtn: {
    padding: 11,
  },
  modeBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingVertical: 4,
    marginBottom: SPACING.s,
  },
  favFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 4,
  },
  favFilterChipActive: {
    backgroundColor: '#EF4444',
  },
  favFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  favFilterTextActive: {
    color: COLORS.white,
  },
  catChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  catChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  resultsCountRow: {
    marginBottom: SPACING.s,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  vocabGrid: {
    gap: SPACING.m,
  },
  emptyWrap: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  wordCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    ...SHADOWS.card,
  },
  wordCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  wordTitleWrap: {
    flex: 1,
  },
  wordTitle: {
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
  wordCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favBtn: {
    padding: 6,
  },
  wordTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.s,
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  categoryBadgeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  meaningLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  meaningVal: {
    fontSize: 14,
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
  exampleEnRow: {
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

  // Flashcards
  flashcardWrap: {
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  fcMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.m,
  },
  fcIndex: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  fcHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  fcBigCard: {
    width: '100%',
    minHeight: 230,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: 2,
    marginBottom: SPACING.l,
  },
  fcBigFront: {
    borderColor: '#EEF2FF',
  },
  fcBigBack: {
    borderColor: '#DCFCE7',
    backgroundColor: '#F0FDF4',
  },
  fcInner: {
    alignItems: 'center',
    width: '100%',
  },
  fcTypeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fcMainWord: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  fcMainPron: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  fcTapInstruction: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.l,
  },
  fcMeaningMr: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  fcMeaningHi: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  fcExWrap: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    width: '100%',
  },
  fcExEn: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  fcExLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  fcNavControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: SPACING.m,
  },
  fcNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fcNavFlipBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fcNavBtnDisabled: {
    opacity: 0.4,
  },
  fcNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Verbs Mode
  verbModeStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verbModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  verbModeBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  verbModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  verbModeTextActive: {
    color: COLORS.white,
  },
  verbTypeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
    marginTop: 4,
  },
  verbTypeChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verbTypeChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  verbTypeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  verbTypeChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  verbsList: {
    gap: SPACING.m,
  },
  verbCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    ...SHADOWS.card,
  },
  verbCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  verbEnMain: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  verbLocMeaning: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  verbBadgeWrap: {},
  verbBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  badgeIrreg: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  badgeReg: {
    backgroundColor: '#F3F4F6',
    color: COLORS.textMuted,
  },
  formsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.s,
    marginBottom: SPACING.s,
  },
  formCol: {
    flex: 1,
    alignItems: 'center',
  },
  formColLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  formColVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  verbExampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.s,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },

  // Table
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    paddingHorizontal: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeadCol: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCellWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tableDataMain: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  tableDataLoc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Quiz Drill
  quizDrillWrap: {},
  quizDrillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  quizDrillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  quizDrillScore: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  quizDrillCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  quizDrillPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  quizDrillOptions: {
    gap: SPACING.s,
  },
  drillOptBtn: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  drillOptText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  drillCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: COLORS.secondary,
  },
  drillWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  drillFeedback: {
    marginTop: SPACING.l,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    alignItems: 'center',
  },
  drillFeedbackText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  drillFormsSummary: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.m,
  },
  drillNextBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  drillNextBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
