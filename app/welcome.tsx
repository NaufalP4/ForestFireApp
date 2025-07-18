// app/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FB9E3A', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>WELCOME TO MY APP</Text>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#C53621',
  },
  loginButton: {
    backgroundColor: '#E6521F',
    paddingVertical: 15, // tombol lebih tinggi
    paddingHorizontal: 100, // tombol lebih panjang
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 200, // tombol turun sedikit
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold', // tebal
  },
  signupButton: {
    borderWidth: 2,
    borderColor: '#E6521F',
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: 50,
  },
  signupText: {
    color: '#E6521F',
    fontSize: 18,
    fontWeight: 'bold', // tebal
  },
});

