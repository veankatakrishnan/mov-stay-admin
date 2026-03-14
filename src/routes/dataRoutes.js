const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/users', dataController.getUsersData);
router.get('/listings', dataController.getListingsData);
router.get('/bookings', dataController.getBookingsData);
router.get('/roommates', dataController.getRoommatesData);
router.get('/complaints', dataController.getComplaintsData);

module.exports = router;
