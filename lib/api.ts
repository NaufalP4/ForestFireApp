// lib/api.ts

export const BASE_URL_USER = 'http://192.168.87.234:3000/api/users';
export const BASE_URL_ZONA = 'http://192.168.87.234:3000/api/zona';
export const BASE_URL = 'http://192.168.87.234:3000/api';

// 🔑 Register User
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL_USER}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error('Gagal registrasi');
    return await res.json();
  } catch (err) {
    console.error('Register Error:', err);
    return { success: false, message: 'Server error' };
  }
};

// 🔑 Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL_USER}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Gagal login');
    const data = await res.json();
    if (data.success && !data.username) data.username = 'Guest';
    return data;
  } catch (err) {
    console.error('Login Error:', err);
    return { success: false, message: 'Server error' };
  }
};

// ✅ Simpan Zona
export const saveZona = async (
  nama_area: string,
  latitude: number,
  longitude: number,
  deskripsi: string,
  foto: any[] // array file image
) => {
  const formData = new FormData();
  formData.append('nama_area', nama_area);
  formData.append('latitude', latitude.toString());
  formData.append('longitude', longitude.toString());
  formData.append('deskripsi', deskripsi);
  foto.forEach((file, index) => {
    formData.append('foto', {
      uri: file.uri,
      name: `foto-${index}.jpg`,
      type: 'image/jpeg',
    } as any);
  });

  const res = await fetch(`${BASE_URL_ZONA}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  return await res.json();
};

// 🔍 Simpan Cuaca
export const saveWeatherToDB = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/weather/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Save weather error:', err);
  }
};

// 📥 Ambil Data Zona per Tanggal
export const getKejadianByDate = async (date: string) => {
  try {
    const res = await fetch(`${BASE_URL}/zona/kejadian/${date}`);
    return await res.json();
  } catch (err) {
    console.error('Get kejadian error:', err);
    return { success: false, data: [] };
  }
};

export const getWeatherByDate = async (date: string) => {
  try {
    const res = await fetch(`${BASE_URL}/weather/by-date/${date}`);
    return await res.json();
  } catch (err) {
    console.error('Get weather error:', err);
    return { success: false };
  }
};