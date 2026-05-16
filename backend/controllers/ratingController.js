const { Rating, Store, User } = require('../models');

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (!storeId || !rating) return res.status(400).json({ message: 'storeId and rating required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { userId: req.user.id, storeId } });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json(existing);
    }

    const newRating = await Rating.create({ userId: req.user.id, storeId, rating });

    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsForStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.findAll({ where: { storeId }, include: [{ model: User, attributes: ['id', 'name', 'email'] }] });
    const avg = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;
    res.json({ average: avg, count: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
