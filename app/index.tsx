// app/index.tsx
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome'); // Pindah ke welcome setelah 2 detik
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#FB9E3A', '#D5451B']}
      style={styles.container}
    >
      <Animatable.Text
        animation="fadeInDown"
        duration={1500}
        style={styles.title}
      >
        Forest Fire
      </Animatable.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFE6E1',
  },
});
