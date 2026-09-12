const express = require('express');
const router = express.Router();
const aiSpeakingController = require('../controllers/aiSpeakingController');

router.get('/scenarios', aiSpeakingController.getScenarios);
router.post('/ai-conversation', aiSpeakingController.chatWithAI);

module.exports = router;
