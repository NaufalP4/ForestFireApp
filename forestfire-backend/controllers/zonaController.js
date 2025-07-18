const db = require('../db');
const path = require('path');
const fs = require('fs');

exports.createZona = (req, res) => {
  const { nama_area, latitude, longitude, deskripsi } = req.body;
  const files = req.files; // banyak gambar

  if (!nama_area || !latitude || !longitude || !deskripsi) {
    return res.status(400).json({ success: false, message: 'Lengkapi semua data' });
  }

  // Ambil semua nama file
  const filenames = files.map((file) => file.filename); // ['1699712823-foto1.jpg', ...]

  // Simpan sebagai JSON string ke kolom 'foto'
  const fotoJson = JSON.stringify(filenames);

  const query = `
    INSERT INTO zona (nama_area, latitude, longitude, deskripsi, foto)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nama_area, latitude, longitude, deskripsi, fotoJson],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({ success: true, message: 'Zona berhasil disimpan' });
    }
  );
};

exports.getAllZona = (req, res) => {
  db.query('SELECT * FROM zona ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, zona: results });
  });
};

exports.deleteZona = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM zona WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: 'Zona berhasil dihapus' });
  });
};

exports.getZonaById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM zona WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Zona not found' });
    res.json({ success: true, zona: results[0] });
  });
};

exports.getPeringatan = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT z.id, z.nama_area, z.latitude, z.longitude, z.risiko_level, u.username
      FROM zona z
      JOIN users u ON z.user_id = u.id
      WHERE z.risiko_level IN ('Tinggi', 'Sedang')
    `);
    res.json({ peringatan: rows });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data peringatan' });
  }
};

exports.getKejadianByDate = (req, res) => {
  const date = req.params.date;
  const query = `
    SELECT nama_area, COUNT(*) AS total
    FROM zona
    WHERE DATE(updated_at) = ?
    GROUP BY nama_area
  `;
  db.query(query, [date], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0) return res.json({ success: true, data: [] });
    res.json({ success: true, data: results });
  });
};