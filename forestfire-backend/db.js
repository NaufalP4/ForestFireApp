// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',      // host database MySQL
  user: 'root',           // user MySQL (default XAMPP: root)
  password: '',           // password MySQL (default XAMPP: kosong)
  database: 'forestfire_db'  // ganti dengan nama database kamu
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = db;
