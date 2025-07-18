import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function UbahUsernameScreen() {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState('');

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
        <Text style={styles.headerTitle}>Ubah username</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.username}>Naufal</Text>
        <Text style={styles.email}>Naufal123@gmail.com</Text>

        <Text style={styles.label}>Masukan username baru</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={newUsername}
            onChangeText={setNewUsername}
            style={styles.input}
            placeholder="Username baru"
          />
          <Feather name="edit-2" size={18} color="#000" />
        </View>

        <TouchableOpacity style={styles.saveButton}
        onPress={() => {router.push('/akun')}}
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
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
  formContainer: {
    backgroundColor: '#F5E29E',
    borderRadius: 12,
    padding: 20,
    marginTop: 100,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#000',
  },
  email: {
    textAlign: 'center',
    marginBottom: 50,
    color: '#000',
  },
  label: {
    marginBottom: 5,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#F98F37',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 50,
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
