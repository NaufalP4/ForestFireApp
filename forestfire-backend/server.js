const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/users');
const zonaRoutes = require('./routes/zona'); // ✅ Tambahkan ini
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Pakai route
app.use('/api/users', userRoutes);
app.use('/api/zona', zonaRoutes); // ✅ Tambahkan ini
app.use('/api/weather', weatherRoutes);

// DENGAN 0.0.0.0 agar bisa diakses dari HP di jaringan lokal
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
