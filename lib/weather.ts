import axios from 'axios';

const API_KEY = 'b96964143fe6f801cb6c61cc90ce05be'; // ✅ Ganti dengan API key OpenWeather

export const getWeather = async (lat: number, lon: number) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await axios.get(url);

  return {
    temp: res.data.main.temp,
    humidity: res.data.main.humidity,
    wind: res.data.wind.speed,
  };
};
