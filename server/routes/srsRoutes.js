const express = require('express');
const router = express.Router();
const srsController = require('../controllers/srsController');

router.get('/due', srsController.getDueReviews);
router.get('/stats', srsController.getSRSStats);
router.post('/answer', srsController.updateSRSBox);

module.exports = router;
