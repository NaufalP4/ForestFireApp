import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Zona = {
  id: number;
  nama_area: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
};

export default function TampilkanZonaScreen() {
  const [zonaList, setZonaList] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://192.168.87.234:3000/api/zona');
        const data = await res.json();

        if (Array.isArray(data.zona)) {
          setZonaList(data.zona);
        } else {
          Alert.alert('Data zona kosong');
        }
      } catch (err) {
        console.error('❌ Gagal ambil zona:', err);
        Alert.alert('Gagal memuat data zona');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tampilkan Zona</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {zonaList.map((zona) => (
          <TouchableOpacity
            key={zona.id}
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/zona-risiko',
                params: {
                  latitude: zona.latitude.toString(),
                  longitude: zona.longitude.toString(),
                },
              });
            }}
          >
            <Text style={styles.title}>{zona.nama_area}</Text>
            <Text style={styles.detail}>Lat: {zona.latitude}</Text>
            <Text style={styles.detail}>Lng: {zona.longitude}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 50 },
  header: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 50,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D5451B',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#333',
  },
});
