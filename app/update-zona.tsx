import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function UpdateZonaScreen() {
  const router = useRouter();
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [namaArea, setNamaArea] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin lokasi ditolak');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setCoordinates({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoordinates({ latitude, longitude });

    try {
      const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const kab = geo.subregion || geo.city || geo.region || 'Unknown';
      setNamaArea(kab);
    } catch {
      setNamaArea('');
    }
  };

  // ✅ Ambil foto dari kamera (bukan galeri)
  const ambilFotoDariKamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  const handleSubmit = async () => {
    if (!coordinates || !namaArea.trim() || !deskripsi.trim() || images.length === 0) {
      Alert.alert('Lengkapi semua data terlebih dahulu');
      return;
    }

    setUploading(true);
    const formData = new FormData();

    formData.append('nama_area', namaArea);
    formData.append('latitude', coordinates.latitude.toString());
    formData.append('longitude', coordinates.longitude.toString());
    formData.append('deskripsi', deskripsi);

    images.forEach((img, index) => {
      const uriParts = img.uri.split('.');
      const ext = uriParts[uriParts.length - 1];

      formData.append('foto', {
        uri: img.uri,
        name: `foto_${index}.${ext}`,
        type: `image/${ext}`,
      } as any);
    });

    try {
      const res = await fetch('http://192.168.87.234:3000/api/zona', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const json = await res.json();
      if (json.success) {
        Alert.alert('Berhasil', 'Zona berhasil disimpan!');
        router.back();
      } else {
        Alert.alert('Gagal', json.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Gagal mengirim data');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Zona</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Konten utama: Map + Form */}
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates?.latitude || -6.2,
            longitude: coordinates?.longitude || 106.8,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {coordinates && <Marker coordinate={coordinates} />}
        </MapView>

        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            style={styles.input}
            value={namaArea}
            onChangeText={setNamaArea}
            placeholder="Nama Area"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Deskripsi"
            multiline
          />

          <TouchableOpacity onPress={ambilFotoDariKamera} style={styles.imagePicker}>
            <Text style={{ color: '#000' }}>Ambil Foto dengan Kamera</Text>
          </TouchableOpacity>

          <ScrollView horizontal>
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img.uri }}
                style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={uploading}>
            <Text style={styles.saveButtonText}>
              {uploading ? 'Menyimpan...' : 'Simpan Zona'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50, // ✅ Sesuai permintaan dosen
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', },
  map: { height: 400, width: '100%', marginTop: 10 },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  imagePicker: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
