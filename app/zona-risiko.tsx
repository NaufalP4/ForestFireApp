import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker, Region } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

type Zona = {
  id: number;
  nama_area: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
};

export default function ZonaRisikoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [userLocation, setUserLocation] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRegion, setMapRegion] = React.useState<Region | null>(null);
  const [zonaList, setZonaList] = React.useState<Zona[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const defaultRegion: Region = {
    latitude: -7.797068,
    longitude: 110.370529,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };

  // Cek apakah ada koordinat dari params
  React.useEffect(() => {
    (async () => {
      const lat = parseFloat(params.latitude as string);
      const lng = parseFloat(params.longitude as string);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        return;
      }

      // Kalau tidak ada parameter, fallback ke lokasi pengguna
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin lokasi ditolak');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(current);

      setMapRegion({
        ...current,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, [params.latitude, params.longitude]);

  // Ambil data zona dari backend
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://192.168.87.234:3000/api/zona');
        const data = await res.json();

        const zonaArray = Array.isArray(data.zona) ? data.zona : [];

        const parsedZona: Zona[] = zonaArray
          .map((z: any): Zona => ({
            id: z.id,
            nama_area: z.nama_area,
            deskripsi: z.deskripsi,
            latitude: parseFloat(z.latitude),
            longitude: parseFloat(z.longitude),
          }))
          .filter((z: Zona) => !isNaN(z.latitude) && !isNaN(z.longitude));

        console.log('✅ Zona valid dari backend:', parsedZona);
        setZonaList(parsedZona);
      } catch (err) {
        console.error('❌ Gagal ambil data zona:', err);
        Alert.alert('Gagal memuat zona dari server');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = () => {
    const zonaMatch = zonaList.find((z) =>
      z.nama_area?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    if (zonaMatch) {
      setMapRegion({
        latitude: zonaMatch.latitude,
        longitude: zonaMatch.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      Keyboard.dismiss();
    } else {
      Alert.alert('Zona tidak ditemukan', 'Nama area tidak ada dalam database.');
    }
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona Kebakaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Image source={require('../assets/images/fire-icon.png')} style={styles.fireIconBg} />
        <View style={styles.iconTitleRow}>
          <Feather name="map-pin" size={40} color="#fff" style={styles.locationIcon} />
          <Text style={styles.cardTitle}>Deteksi Zona Kebakaran</Text>
        </View>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#aaa" style={styles.searchIcon} />
          <TextInput
            placeholder="Cari Nama Daerah"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <MapView
            style={styles.map}
            region={mapRegion || defaultRegion}
            showsUserLocation
            showsMyLocationButton
            onMapReady={() => console.log('🗺️ Map ready')}
          >
            {zonaList.map((zona) => (
              <Marker
                key={zona.id}
                coordinate={{
                  latitude: zona.latitude,
                  longitude: zona.longitude,
                }}
                title={zona.nama_area}
                description={zona.deskripsi}
              />
            ))}
          </MapView>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/tampilkan-zona')}>
          <Text style={styles.buttonText}>Tampilkan Zona</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/update-zona')}>
          <Text style={styles.buttonText}>Tambah Zona</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 50 },
  header: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#E22B1D',
    margin: 25,
    borderRadius: 30,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  fireIconBg: {
    position: 'absolute',
    right: 100,
    top: -20,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  mapContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    height: 425,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFE6E1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
