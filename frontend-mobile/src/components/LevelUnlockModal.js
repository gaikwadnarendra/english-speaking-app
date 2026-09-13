import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useProgress } from '../context/ProgressContext';
import { Trophy, ArrowRight, CheckCircle2 } from 'lucide-react-native';

export default function LevelUnlockModal() {
  const { completionModal, closeCompletionModal } = useProgress();

  if (!completionModal) return null;

  return (
    <Modal
      visible={Boolean(completionModal)}
      animationType="fade"
      transparent={true}
      onRequestClose={closeCompletionModal}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.trophyWrap}>
            <Trophy size={48} color="#eab308" />
          </View>

          <Text style={styles.congratsText}>अभिनंदन! 🎉</Text>
          <Text style={styles.levelDoneText}>
            तुम्ही <Text style={styles.highlight}>{completionModal.levelNameMr || completionModal.levelName}</Text> पूर्ण केले आहे!
          </Text>

          {completionModal.nextLevelId ? (
            <View style={styles.nextLevelBox}>
              <CheckCircle2 size={18} color="#10b981" />
              <Text style={styles.nextLevelText}>
                Level {completionModal.nextLevelId} आता अनलॉक झाले आहे!
              </Text>
            </View>
          ) : (
            <View style={styles.nextLevelBox}>
              <CheckCircle2 size={18} color="#10b981" />
              <Text style={styles.nextLevelText}>
                सर्व लेव्हल्स यशस्वीरीत्या पूर्ण केल्या आहेत! 🌟
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={closeCompletionModal}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>शिकणे चालू ठेवा</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fef9c3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fde047',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  levelDoneText: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  highlight: {
    fontWeight: '700',
    color: '#4f46e5',
  },
  nextLevelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nextLevelText: {
    color: '#065f46',
    fontSize: 13,
    fontWeight: '700',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    height: 48,
    width: '100%',
    gap: 8,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  }
});
