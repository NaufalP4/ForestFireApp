const db = require('../db');

exports.saveWeather = (req, res) => {
  const { date, location_name, latitude, longitude, temperature, humidity, wind } = req.body;

  const query = `
    INSERT INTO weather_history (date, location_name, latitude, longitude, temperature, humidity, wind)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      temperature = VALUES(temperature),
      humidity = VALUES(humidity),
      wind = VALUES(wind)
  `;

  db.query(query, [date, location_name, latitude, longitude, temperature, humidity, wind], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menyimpan data cuaca' });
    res.json({ success: true, message: 'Data cuaca disimpan' });
  });
};

exports.getWeatherByDate = (req, res) => {
  const date = req.params.date;

  const query = 'SELECT * FROM weather_history WHERE date = ? LIMIT 1';
  db.query(query, [date], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (result.length > 0) {
      res.json({ success: true, data: result[0] });
    } else {
      res.json({ success: false, message: 'Data not found' });
    }
  });
};
