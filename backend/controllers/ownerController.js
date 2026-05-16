const { Store, Rating, User } = require('../models');

exports.getOwnerDashboard = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    const data = stores.map((store) => {
      const plain = store.get({ plain: true });
      const ratings = plain.Ratings || [];
      const averageRating = ratings.length
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 0;

      return {
        id: plain.id,
        name: plain.name,
        email: plain.email,
        address: plain.address,
        averageRating: Number(averageRating.toFixed(2)),
        ratingCount: ratings.length,
        ratings,
      };
    });

    res.json({ stores: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
