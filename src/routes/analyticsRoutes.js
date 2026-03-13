const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/users', analyticsController.getUsersAnalytics);
router.get('/listings', analyticsController.getListingsAnalytics);
router.get('/bookings', analyticsController.getBookingsAnalytics);
router.get('/roommates', analyticsController.getRoommatesAnalytics);
router.get('/complaints', analyticsController.getComplaintsAnalytics);

module.exports = router;
