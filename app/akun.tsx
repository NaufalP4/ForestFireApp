import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Tambah import ini

export default function AkunScreen() {
  const router = useRouter();

  // Fungsi Keluar
  const handleLogout = async () => {
    try {
      // Jika kamu menyimpan token, hapus di sini:
      await AsyncStorage.removeItem('userToken');

      // Ganti halaman ke login, supaya tidak bisa back lagi
      router.replace('/login');
    } catch (error) {
      console.log('Gagal logout:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#FB9E3A', '#D5451B']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Akun</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Profile */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('@/assets/images/man.png')}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={() => router.push('/ubah-profil')}
          >
            <Feather name="camera" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>Naufal</Text>
        <Text style={styles.email}>Naufal123@gmail.com</Text>
      </View>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>SETELAN</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => router.push('/ubah-username')}
        >
          <FontAwesome name="user" size={20} color="#000" />
          <Text style={styles.settingText}>Ubah Username</Text>
          <Feather name="chevron-right" size={20} color="#000" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => router.push('/ubah-password')}>
          <FontAwesome name="lock" size={20} color="#000" />
          <Text style={styles.settingText}>Ganti Password</Text>
          <Feather name="chevron-right" size={20} color="#000" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Tombol Logout dihubungkan ke handleLogout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#000" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// Styles tetap sama persis
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  username: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#fff',
  },
  settingsContainer: {
    backgroundColor: '#F5E29E',
    borderRadius: 12,
    padding: 20,
  },
  settingsTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F98F37',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F98F37',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#000',
  },
});
