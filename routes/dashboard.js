const express = require('express');
const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/dashboard', requireAuth, dashboardController.index);

module.exports = router;
