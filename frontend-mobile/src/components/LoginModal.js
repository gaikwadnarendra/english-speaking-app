import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, isAuthenticated, user, logout } = useAuth();
  const { t, language, changeLanguage } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState(language || 'mr');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg(language === 'mr' ? 'कृपया सर्व माहिती भरा.' : 'Please fill all required fields.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg(language === 'mr' ? 'कृपया तुमचे नाव टाका.' : 'Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(language === 'mr' ? 'पासवर्ड किमान 6 अक्षरांचा असावा.' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await login(email.trim(), password);
      } else {
        result = await register(name.trim(), email.trim(), password, selectedLang);
        if (selectedLang !== language) {
          changeLanguage(selectedLang);
        }
      }

      if (result.success) {
        Alert.alert(
          mode === 'login' ? 'लॉगिन यशस्वी!' : 'नोंदणी यशस्वी!',
          mode === 'login' ? 'तुमचे स्वागत आहे 🎉' : 'तुमचे खाते तयार झाले आहे! आता शिका न थांबता 🚀'
        );
        resetForm();
      } else {
        setErrorMsg(result.message || 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (e) {
      setErrorMsg(e.message || 'सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login('demo@learner.com', 'password123');
      if (res.success) {
        Alert.alert('Demo Account Active', 'Demo Learner खात्यात स्वागत आहे! 🎓');
        resetForm();
      } else {
        setErrorMsg(res.message);
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <Modal
      visible={isAuthModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                {isAuthenticated ? 'वापरकर्ता प्रोफाइल' : (mode === 'login' ? 'खात्यात लॉगिन करा 🔑' : 'नवीन खाते तयार करा ✨')}
              </Text>
              <Text style={styles.subtitleText}>
                {isAuthenticated ? user?.email : 'तुमची प्रगती कायम सेव्ह करण्यासाठी खाते वापरा'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {isAuthenticated ? (
              // Already logged in view
              <View style={styles.loggedInBox}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                </View>
                <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                
                <View style={styles.badgeRow}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <Text style={styles.badgeText}>खाते सक्रिय आहे (Active Account)</Text>
                </View>

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => {
                    logout();
                    Alert.alert('लॉगआउट झाले', 'तुम्ही यशस्वीरीत्या लॉगआउट झाला आहात.');
                  }}
                >
                  <Text style={styles.logoutBtnText}>लॉगआउट करा (Logout)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Auth form view
              <>
                {/* Mode Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
                    onPress={() => { setMode('login'); setErrorMsg(''); }}
                  >
                    <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                      लॉगिन (Login)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
                    onPress={() => { setMode('register'); setErrorMsg(''); }}
                  >
                    <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                      नोंदणी (Register)
                    </Text>
                  </TouchableOpacity>
                </View>

                {errorMsg ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                {/* Form fields */}
                {mode === 'register' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>पूर्ण नाव (Full Name)</Text>
                    <View style={styles.inputWrap}>
                      <User size={18} color="#64748b" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="उदा. राहुल शिंदे"
                        placeholderTextColor="#94a3b8"
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ईमेल पत्ता (Email)</Text>
                  <View style={styles.inputWrap}>
                    <Mail size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>पासवर्ड (Password)</Text>
                  <View style={styles.inputWrap}>
                    <Lock size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="किमान 6 अक्षरे"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>
                </View>

                {/* Submit button */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {mode === 'login' ? 'लॉगिन करा 🚀' : 'नवीन खाते बनवा 🎉'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Quick Demo Login */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>किंवा (OR)</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={handleDemoLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Sparkles size={18} color="#4f46e5" />
                  <Text style={styles.demoBtnText}>1-Tap Demo Account ने सुरू करा</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  submitBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderWidth: 1.5,
    borderColor: '#c7d2fe',
    borderRadius: 14,
    height: 48,
    gap: 8,
  },
  demoBtnText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  loggedInBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  badgeText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  }
});
