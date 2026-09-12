const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');

router.get('/quiz', practiceController.getQuizzes);
router.post('/submit', practiceController.submitQuizResult);

module.exports = router;
