const express = require('express');
const router = express.Router();
const { getStores, createStore } = require('../controllers/storeController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', auth, getStores);
router.post('/', auth, authorize('ADMIN', 'OWNER'), createStore);

module.exports = router;
