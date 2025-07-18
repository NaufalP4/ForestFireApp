const db = require('../db');

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User registered successfully!' });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
      } else {
        if (results.length > 0) {
          // Ambil username dari hasil query
          const username = results[0].username;

          res.status(200).json({
            success: true,
            message: 'Login success',
            username: username, // ✅ tambahkan username di response
          });
        } else {
          res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
      }
    }
  );
};

exports.ping = (req, res) => {
  res.send('API working 🚀');
};
