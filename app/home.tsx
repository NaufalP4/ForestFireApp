import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeather as fetchWeatherAPI } from '../lib/weather';
import * as Location from 'expo-location';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, BackHandler, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>{icon}</View>
    <Text style={styles.menuText}>{title}</Text>
    <Feather name="chevron-right" size={20} color="#000" />
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('User');
  const [weather, setWeather] = useState({ temp: 0, humidity: 0, wind: 0 });

  // 👉 Saat FOCUS: ambil cache dulu, lalu update fresh di background
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const name = await AsyncStorage.getItem('username');
          if (name) setUsername(name);

          // Ambil data cuaca lama dari AsyncStorage kalau ada
          const cachedWeather = await AsyncStorage.getItem('weather');
          if (cachedWeather) {
            setWeather(JSON.parse(cachedWeather));
          }

          // Panggil update baru di background
          await fetchWeather();
        } catch (err) {
          console.error('Gagal ambil data:', err);
        }
      };

      loadData();
      return () => {};
    }, [])
  );

  // Tangani tombol back: konfirmasi keluar
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Konfirmasi',
        'Apakah Anda ingin keluar?',
        [
          { text: 'Tidak', style: 'cancel' },
          { text: 'Ya', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // ✅ Ambil data cuaca baru & simpan ke cache
  const fetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Izin lokasi ditolak');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      const data = await fetchWeatherAPI(lat, lon);
      setWeather(data);

      // Simpan cache terbaru
      await AsyncStorage.setItem('weather', JSON.stringify(data));
    } catch (err) {
      console.error('Gagal ambil cuaca:', err);
    }
  };
  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcome}>Selamat Datang</Text>
            <View style={styles.avatarRow}>
              <Image source={require('@/assets/images/man.png')} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.status}>Aktif</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Image source={require('@/assets/images/fire-icon.png')} style={styles.fireIcon} />
            <View style={styles.textOverlay}>
              <Text style={styles.systemName}>FOREST FIRE</Text>
            </View>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <View style={styles.weatherItem}>
            <Feather name="thermometer" size={24} color="#000" />
            <Text style={styles.weatherLabel}>TEMPERATUR</Text>
            <Text style={styles.weatherValue}>{weather.temp}°</Text>
          </View>
          <View style={styles.weatherItem}>
            <Feather name="droplet" size={24} color="#000" />
            <Text style={styles.weatherLabel}>KELEMBAPAN</Text>
            <Text style={styles.weatherValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.weatherItem}>
            <Feather name="wind" size={24} color="#000" />
            <Text style={styles.weatherLabel2}>KECEPATAN</Text>
            <Text style={styles.weatherLabel2}>ANGIN</Text>
            <Text style={styles.weatherValue2}>{weather.wind} km/h</Text>
          </View>
        </View>

        <MenuItem 
          icon={<Feather name="cloud" size={20} />} 
          title="Data Cuaca" 
          onPress={() => router.push('/data-cuaca')} 
        />
        <MenuItem 
          icon={<FontAwesome5 name="map-marker-alt" size={20} />} 
          title="Zona Kebakaran" 
          onPress={() => router.push('/zona-risiko')} 
        />
        <MenuItem 
          icon={<MaterialCommunityIcons name="fire-alert" size={20} />} 
          title="Peringatan" 
          onPress={() => router.push('/peringatan')} 
        />
        <MenuItem 
          icon={<MaterialCommunityIcons name="history" size={20} />} 
          title="Riwayat Kebakaran" 
          onPress={() => router.push('/riwayat-risiko')} 
        />
        <MenuItem 
          icon={<Feather name="user" size={20} />} 
          title="Akun" 
          onPress={() => router.push('/akun')} 
        />
      </ScrollView>
    </LinearGradient>
  );
}

// ✅ Styles tetap PERSIS milikmu, tidak diubah sama sekali
const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 50 },
  scrollContainer: { padding: 20, paddingTop: 60, paddingBottom: 30 },
  headerCard: {
    backgroundColor: '#EA2F14',
    borderRadius: 12,
    padding: 15,
    paddingVertical: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'column', alignItems: 'flex-start' },
  welcome: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  status: { color: '#11FF00', fontSize: 12 },
  headerRight: {
    position: 'relative',
    width: 120,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireIcon: {
    position: 'absolute',
    width: 150,
    height: 180,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  textOverlay: { alignItems: 'center' },
  systemName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', width: 140 },
  subText: { color: '#fff', fontSize: 16 },
  weatherCard: {
    backgroundColor: '#FFE6E1',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weatherItem: { alignItems: 'center', flex: 1 },
  weatherLabel: { marginTop: 5, fontSize: 12, fontWeight: 'bold', color: '#000' },
  weatherLabel2: { marginTop: 5, fontSize: 11, fontWeight: 'bold' },
  weatherValue: { fontSize: 20, marginTop: 25 },
  weatherValue2: { fontSize: 19, marginTop: 5 },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFE6E1',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: { marginRight: 15 },
  menuText: { flex: 1, fontSize: 16 },
});
