const express = require('express');
const router = express.Router();
const vocabController = require('../controllers/vocabController');

router.get('/', vocabController.getAllVocab);
router.get('/categories', vocabController.getCategories);
router.post('/:id/toggle-favorite', vocabController.toggleFavorite);

module.exports = router;
