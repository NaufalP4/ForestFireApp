import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeather as fetchWeatherAPI } from '../lib/weather';
import { saveWeatherToDB, getKejadianByDate } from '../lib/api';

const todayString = new Date().toISOString().split('T')[0];

export default function DataCuacaScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [weather, setWeather] = useState({ temp: 0, humidity: 0, wind: 0 });
  const [kejadian, setKejadian] = useState<{ nama_area: string; total: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleFetchData(todayString);
  }, []);

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    handleFetchData(date);
  };

  const handleFetchData = async (date: string) => {
    setLoading(true);
    try {
      const kejadianRes = await getKejadianByDate(date);
      setKejadian(kejadianRes.success ? kejadianRes.data : []);

      // Jika tanggal hari ini, cek cache dulu
      if (date === todayString) {
        const cached = await AsyncStorage.getItem(`weather-${date}`);
        if (cached) {
          setWeather(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const locPerm = await Location.requestForegroundPermissionsAsync();
        if (locPerm.status !== 'granted') {
          console.log('Izin lokasi ditolak');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        const cuaca = await fetchWeatherAPI(lat, lon);
        setWeather(cuaca);

        await AsyncStorage.setItem(`weather-${date}`, JSON.stringify(cuaca));
        await saveWeatherToDB({
          date,
          location_name: 'Unknown',
          latitude: lat,
          longitude: lon,
          temperature: cuaca.temp,
          humidity: cuaca.humidity,
          wind: cuaca.wind,
        });
      }
      // Tanggal lampau: fetch dari DB
      else if (date < todayString) {
        const res = await fetch(`http://192.168.87.234:3000/api/weather/${date}`);
        const json = await res.json();
        if (json.success && json.data) {
          setWeather({
            temp: json.data.temperature || 0,
            humidity: json.data.humidity || 0,
            wind: json.data.wind || 0,
          });
        } else {
          setWeather({ temp: 0, humidity: 0, wind: 0 });
        }
      }
      // Tanggal ke depan
      else {
        setWeather({ temp: 0, humidity: 0, wind: 0 });
      }
    } catch (err) {
      console.error('Gagal fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Cuaca</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.weatherCard}>
        <View style={styles.weatherItem}>
          <Feather name="thermometer" size={24} color="#000" />
          <Text style={styles.weatherLabel}>TEMPERATUR</Text>
          <Text style={styles.weatherValue}>{`${weather.temp}°`}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.weatherItem}>
          <Feather name="droplet" size={24} color="#000" />
          <Text style={styles.weatherLabel}>KELEMBAPAN</Text>
          <Text style={styles.weatherValue}>{`${weather.humidity}%`}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.weatherItem}>
          <Feather name="wind" size={24} color="#000" />
          <Text style={styles.weatherLabel}>KECEPATAN</Text>
          <Text style={styles.weatherLabel}>ANGIN</Text>
          <Text style={styles.weatherValue}>{`${weather.wind} km/h`}</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#FB9E3A',
              dotColor: '#FB9E3A',
            },
          }}
          theme={{
            selectedDayBackgroundColor: '#FB9E3A',
            todayTextColor: '#FB9E3A',
            arrowColor: '#FB9E3A',
          }}
        />
      </View>

      <ScrollView style={styles.kejadianContainer}>
        <Text style={styles.kejadianTitle}>Informasi Kejadian:</Text>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : kejadian.length === 0 ? (
          <Text style={{ color: '#fff', fontStyle: 'italic' }}>Tidak ada kejadian</Text>
        ) : (
          kejadian.map((item, idx) => (
            <View key={idx} style={styles.kejadianRow}>
              <Text style={styles.kejadianText}>{item.nama_area}</Text>
              <Text style={styles.kejadianText}>{item.total}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  weatherCard: {
    backgroundColor: '#FFE6E1',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  weatherItem: { alignItems: 'center', flex: 1 },
  weatherLabel: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  weatherValue: { fontSize: 20, marginTop: 5 },
  separator: { width: 1, backgroundColor: '#ccc', marginHorizontal: 5 },
  calendarContainer: { marginHorizontal: 20, marginBottom: 20 },
  kejadianContainer: { paddingHorizontal: 20, flex: 1 },
  kejadianTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 10 },
  kejadianRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kejadianText: { color: '#fff' },
});
