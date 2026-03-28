import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogiPointColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound } from 'lucide-react-native';

export default function LoginScreen() {
  const [accessCode, setAccessCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const pulse = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(float1, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.timing(float2, { toValue: 1, duration: 11000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ).start();
  }, [pulse, float1, float2]);

  const handleLogin = async () => {
    try {
      setError('');
      if (!accessCode.trim()) {
        setError('Please enter your access code');
        return;
      }
      await login(accessCode);
      router.replace('/(tabs)' as any);
    } catch (err) {
      setError('Invalid access code');
    }
  };

  const blob1Style = useMemo(() => ({
    transform: [
      { translateX: float1.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] }) },
      { translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [10, -10] }) },
      { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
    ],
    opacity: 0.18,
  }), [float1, pulse]);

  const blob2Style = useMemo(() => ({
    transform: [
      { translateX: float2.interpolate({ inputRange: [0, 1], outputRange: [16, -16] }) },
      { translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [-8, 8] }) },
      { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) },
    ],
    opacity: 0.14,
  }), [float2, pulse]);

  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Animated.View style={[styles.blob, styles.blobPrimary, blob1Style]} />
        <Animated.View style={[styles.blob, styles.blobAccent, blob2Style]} />
        <View style={styles.vignette} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>LogiPoint</Text>
          <Text style={styles.subtitle}>Reporting Dashboard</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Access Code</Text>
            <View style={styles.inputWrapper}>
              <KeyRound color={LogiPointColors.gray[500]} size={18} />
              <TextInput
                testID="login-access-code"
                style={styles.input}
                value={accessCode}
                onChangeText={setAccessCode}
                placeholder="Enter access code"
                placeholderTextColor={LogiPointColors.gray[400]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: pressScale }] }}>
            <TouchableOpacity
              testID="login-button"
              style={styles.button}
              onPress={handleLogin}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.midnight,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 9999,
    top: -60,
    right: -40,
  },
  blobPrimary: {
    backgroundColor: LogiPointColors.primary,
  },
  blobAccent: {
    backgroundColor: LogiPointColors.accent,
    top: 160,
    left: -80,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 31, 44, 0.65)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 36,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: LogiPointColors.white,
  },
  subtitle: {
    fontSize: 14,
    color: LogiPointColors.beige,
    fontWeight: '500' as const,
  },
  form: {
    gap: 18,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: LogiPointColors.midnight,
  },
  button: {
    backgroundColor: LogiPointColors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    elevation: 6,
    boxShadow: '0 8px 12px rgba(0,0,0,0.25)',
  },
  buttonText: {
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: LogiPointColors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: LogiPointColors.beige,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(155, 39, 67, 0.2)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.accent,
  },
  errorText: {
    color: LogiPointColors.accent,
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});
