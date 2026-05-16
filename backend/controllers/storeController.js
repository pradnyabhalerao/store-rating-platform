const { Store, Rating, User } = require('../models');

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Rating, attributes: ['rating', 'userId'] },
      ],
      order: [['name', 'ASC']],
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
        owner: plain.owner,
        averageRating: Number(averageRating.toFixed(2)),
        ratingCount: ratings.length,
        userRating: ratings.find((item) => item.userId === req.user?.id)?.rating || null,
      };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name) return res.status(400).json({ message: 'Store name is required' });

    let storeOwnerId = null;

    if (ownerId !== undefined && ownerId !== null && ownerId !== '') {
      storeOwnerId = Number(ownerId);

      if (!Number.isInteger(storeOwnerId) || storeOwnerId <= 0) {
        return res.status(400).json({ message: 'Owner user ID must be a valid number' });
      }

      const owner = await User.findByPk(storeOwnerId);
      if (!owner) {
        return res.status(400).json({
          message: 'Owner user ID does not exist. Leave it blank or use an existing user ID.',
        });
      }
      if (owner.role !== 'OWNER') {
        return res.status(400).json({
          message: 'Owner user ID must belong to a Store Owner account.',
        });
      }
    } else if (req.user?.role === 'OWNER') {
      storeOwnerId = req.user.id;
    }

    const store = await Store.create({ name, email, address, ownerId: storeOwnerId });
    res.status(201).json(store);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Owner user ID does not exist. Leave it blank or use an existing user ID.',
      });
    }

    res.status(500).json({ error: err.message });
  }
};
