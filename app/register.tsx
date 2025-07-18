import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { registerUser } from '../lib/api'; // ✅ import API helper

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [error, setError] = useState(''); // ✅ pesan error

  const router = useRouter();

  // ✅ Fungsi handle register
  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('Semua field harus diisi')
      return;
    }

    try {
      const res = await registerUser(username, email, password);
      if (res.message) {
        router.push('/login');
      } else {
        setError('Registrasi gagal!');
      }
    } catch (error) {
      console.error(error);
      setError('Terjadi kesalahan server');
    }
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>REGISTER</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {/* Username */}
        <View style={styles.inputWrapper}>
          {(usernameFocused || username !== '') && <Text style={styles.label}>Username</Text>}
          <View style={styles.inputGroup}>
            <TextInput
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError('');
              }}
              placeholder={usernameFocused ? '' : 'Username'}
              placeholderTextColor="#000"
              style={styles.input}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
            />
            <Feather name="edit-2" size={20} color="Black" style={styles.icon} />
          </View>
        </View>

        {/* Email */}
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

        {/* Password */}
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
    color: '#C53621',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputWrapper: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'Black',
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
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
