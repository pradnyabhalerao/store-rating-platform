const express = require('express');
const router = express.Router();
const { createUser, getDashboard, listRatings, listStores, listUsers } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/dashboard', auth, authorize('ADMIN'), getDashboard);
router.get('/users', auth, authorize('ADMIN'), listUsers);
router.post('/users', auth, authorize('ADMIN'), createUser);
router.get('/stores', auth, authorize('ADMIN'), listStores);
router.get('/ratings', auth, authorize('ADMIN'), listRatings);

module.exports = router;
