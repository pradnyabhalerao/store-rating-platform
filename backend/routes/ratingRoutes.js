const express = require('express');
const router = express.Router();
const { getRatingsForStore, submitRating } = require('../controllers/ratingController');
const auth = require('../middleware/authMiddleware');

router.get('/store/:storeId', getRatingsForStore);
router.post('/', auth, submitRating);

module.exports = router;
