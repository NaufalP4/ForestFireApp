import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function UbahPasswordScreen() {
  const router = useRouter();

  // State untuk input
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Email & Password Lama */}
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Masukkan email anda saat ini"
              placeholderTextColor="#000"
              value={currentEmail}
              onChangeText={setCurrentEmail}
              style={styles.input}
            />
            <Feather name="edit-2" size={18} color="#000" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#000"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Feather name={showCurrentPassword ? "eye" : "eye-off"} size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Email & Password Baru */}
        <View style={styles.newSection}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Masukkan email baru"
              placeholderTextColor="#000"
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.input}
            />
            <Feather name="edit-2" size={18} color="#000" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#000"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Feather name={showNewPassword ? "eye" : "eye-off"} size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.push('/akun')}
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
  formContainer: {
    backgroundColor: '#F5E29E',
    borderRadius: 12,
    padding: 20,
    marginTop: 70,
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
  newSection: {
    marginTop: 50, // Jarak antar section agar rapi
  },
  saveButton: {
    backgroundColor: '#F98F37',
    borderRadius: 12,
    paddingVertical: 12,
    width: 150,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
