const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const upload = require('../middlewares/upload');

router.post('/', upload.array('foto', 5), zonaController.createZona);
router.post('/save', zonaController.createZona);
router.delete('/:id', zonaController.deleteZona);
router.get('/:id', zonaController.getZonaById);
router.get('/', zonaController.getAllZona);
router.get('/peringatan', zonaController.getPeringatan); // <- penting
router.get('/kejadian/:date', zonaController.getKejadianByDate);

module.exports = router;
