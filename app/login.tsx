import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '../lib/api'; // pastikan ini sesuai path mu
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan Password salah');
      return;
    }

    try {
      const res = await loginUser(email, password);
      if (res.success) {
        await AsyncStorage.setItem('username', res.username); // simpan username
        router.push('/home'); // langsung pindah
      } else {
        setError(res.message || 'Email atau password salah!');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan server.');
    }
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LOGIN</Text>
      </View>

      {/* Error Message */}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {/* Email Field */}
      <View style={styles.inputWrapper}>
        {(emailFocused || email !== '') && <Text style={styles.label}>Email</Text>}
        <View style={styles.inputGroup}>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder={emailFocused ? '' : 'Email'}
            placeholderTextColor="#000"
            style={styles.input}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <Feather name="edit-2" size={20} color="Black" style={styles.icon} />
        </View>
      </View>

      {/* Password Field */}
      <View style={styles.inputWrapper}>
        {(passwordFocused || password !== '') && <Text style={styles.label}>Password</Text>}
        <View style={styles.inputGroup}>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder={passwordFocused ? '' : 'Password'}
            placeholderTextColor="#000"
            secureTextEntry={!showPassword}
            style={styles.input}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="Black"
            onPress={() => setShowPassword(!showPassword)}
            style={styles.icon}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 150,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#C53621',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
    marginLeft: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#E6521F',
    paddingVertical: 15,
    width: 250,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 125,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
