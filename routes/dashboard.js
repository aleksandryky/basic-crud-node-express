const express = require('express');
const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/dashboard', requireAuth, dashboardController.index);
router.get('/users',     requireAuth, dashboardController.users);
router.get('/activity',  requireAuth, dashboardController.activity);
router.get('/settings',  requireAuth, dashboardController.settings);

module.exports = router;
