import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Zona = {
  id: number;
  nama_area: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
};

export default function PeringatanScreen() {
  const router = useRouter();
  const [zonaList, setZonaList] = React.useState<Zona[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://192.168.87.234:3000/api/zona');
        const data = await res.json();

        if (Array.isArray(data.zona)) {
          // Misalnya hanya ambil zona dengan deskripsi mengandung kata "kebakaran"
          const filtered = data.zona.filter((z: Zona) =>
            z.deskripsi?.toLowerCase().includes('kebakaran')
          );
          setZonaList(filtered);
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
        <Text style={styles.headerTitle}>Peringatan Kebakaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={zonaList}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Belum ada peringatan kebakaran.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Feather name="alert-circle" size={24} color="#E22B1D" />
            <View style={styles.cardContent}>
              <Text style={styles.area}>{item.nama_area}</Text>
              <Text style={styles.desc}>{item.deskripsi}</Text>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}

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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  area: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D5451B',
  },
  desc: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 40,
    fontSize: 16,
  },
});
