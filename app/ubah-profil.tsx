import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function UbahProfil() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Izin kamera ditolak!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGallery = () => {
    Alert.alert('Galeri', 'Fitur galeri belum diimplementasikan.');
  };

  const handleAvatar = () => {
    Alert.alert('Pilih Avatar', 'Fitur pilih avatar belum diimplementasikan.');
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Ubah Profil</Text>

      {/* Foto Profil */}
      <View style={styles.profileContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../assets/images/man.png')
          }
          style={styles.avatar}
        />
        <View style={styles.cameraIconContainer}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </View>

      {/* Tombol Pilihan */}
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={handleCamera}>
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.optionText}>KAMERA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleGallery}>
          <MaterialIcons name="photo-library" size={32} color="#fff" />
          <Text style={styles.optionText}>GALERI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleAvatar}>
          <Entypo name="user" size={32} color="#fff" />
          <Text style={styles.optionText}>AVATAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    marginTop: 30,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#0077B6',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 110,
    backgroundColor: '#0077B6',
    borderRadius: 20,
    padding: 5,
  },
  optionContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#778899',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
});
