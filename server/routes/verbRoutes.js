const express = require('express');
const router = express.Router();
const verbController = require('../controllers/verbController');

router.get('/', verbController.getAllVerbs);

module.exports = router;
