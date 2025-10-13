import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogiPointColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viewerCode, setViewerCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleViewerLogin = async () => {
    try {
      setError('');
      if (viewerCode !== '2030') {
        setError('Invalid viewer code');
        return;
      }
      await login('viewer', '');
      router.replace('/(tabs)');
    } catch {
      setError('Login failed');
    }
  };

  const handleAdminLogin = async () => {
    try {
      setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      setError('Invalid admin credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>LogiPoint</Text>
          <Text style={styles.subtitle}>Dashboard & Reporting</Text>
        </View>

        {!isAdminMode ? (
          <View style={styles.form}>
            <Text style={styles.welcomeText}>Welcome to LogiPoint</Text>
            <Text style={styles.description}>View dashboards and reports</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Viewer Code</Text>
              <TextInput
                style={styles.input}
                value={viewerCode}
                onChangeText={setViewerCode}
                placeholder="Enter viewer code"
                placeholderTextColor={LogiPointColors.gray[400]}
                keyboardType="numeric"
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleViewerLogin}>
              <Text style={styles.buttonText}>Continue as Viewer</Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.adminLink} 
              onPress={() => setIsAdminMode(true)}
            >
              <Text style={styles.adminLinkText}>Admin Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.welcomeText}>Admin Login</Text>
            <Text style={styles.description}>Sign in to manage data</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="thamir.sulimani@logipoint.sa"
                placeholderTextColor={LogiPointColors.gray[400]}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={LogiPointColors.gray[400]}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
              <Text style={styles.buttonText}>Sign In as Admin</Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.backLink} 
              onPress={() => {
                setIsAdminMode(false);
                setEmail('');
                setPassword('');
                setViewerCode('');
                setError('');
              }}
            >
              <Text style={styles.backLinkText}>← Back to Viewer Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.midnight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: LogiPointColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: LogiPointColors.beige,
    fontWeight: '500' as const,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  input: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: LogiPointColors.midnight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: LogiPointColors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: LogiPointColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: LogiPointColors.beige,
    textAlign: 'center',
    marginBottom: 32,
  },
  adminLink: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  adminLinkText: {
    fontSize: 15,
    color: LogiPointColors.primary,
    fontWeight: '600' as const,
    textDecorationLine: 'underline',
  },
  backLink: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: LogiPointColors.beige,
    fontWeight: '500' as const,
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
