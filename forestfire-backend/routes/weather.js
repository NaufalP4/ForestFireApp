const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController'); // ⬅️ PENTING!

router.post('/save', weatherController.saveWeather);
router.get('/:date', weatherController.getWeatherByDate); // ⬅️ GANTI dari /by-date/:date

module.exports = router;
