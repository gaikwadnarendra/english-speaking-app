import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react-native';

export default function TrialBanner() {
  const { isAuthenticated, isTrialActive, isTrialExpired, currentTrialDay, trialDaysLeft, openAuthModal } = useAuth();

  // Don't show if user is registered and logged in
  if (isAuthenticated) return null;

  if (isTrialExpired) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.expiredContainer]}
        activeOpacity={0.85}
        onPress={openAuthModal}
      >
        <AlertTriangle size={18} color="#dc2626" />
        <View style={styles.textWrap}>
          <Text style={styles.expiredTitle}>3 दिवसांचा मोफत ट्रायल समाप्त झाला आहे!</Text>
          <Text style={styles.expiredSubtitle}>सर्व 1500+ शब्द आणि AI संभाषण चालू ठेवण्यासाठी मोफत नोंदणी करा 👉</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isTrialActive) {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.85}
        onPress={openAuthModal}
      >
        <Sparkles size={18} color="#4f46e5" />
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>🎁 मोफत गेस्ट ट्रायल: दिवस {currentTrialDay} / 3</Text>
            <View style={styles.badge}>
              <Clock size={11} color="#4f46e5" />
              <Text style={styles.badgeText}>{trialDaysLeft} दिवस शिल्लक</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>प्रगती कायम जतन करण्यासाठी मोफत खाते तयार करा किंवा लॉगिन करा</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expiredContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  expiredTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991b1b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  subtitle: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 2,
    fontWeight: '500',
  },
  expiredSubtitle: {
    fontSize: 11,
    color: '#b91c1c',
    marginTop: 2,
    fontWeight: '600',
  }
});
