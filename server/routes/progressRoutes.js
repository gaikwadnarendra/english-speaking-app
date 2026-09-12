const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.get('/', progressController.getProgress);
router.post('/streak', progressController.incrementStreak);
router.post('/settings', progressController.updateSettings);
router.post('/reset', progressController.resetProgress);

module.exports = router;
