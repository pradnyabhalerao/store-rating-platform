const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { validateUser } = require('../utils/validators');

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { q, role, sortBy = 'id', sortDir = 'ASC' } = req.query;
    const where = {};
    if (role) where.role = role.toUpperCase();
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { address: { [Op.like]: `%${q}%` } },
      ];
    }

    const allowedSort = ['id', 'name', 'email', 'address', 'role'];
    const direction = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      include: [{ model: Store, include: [{ model: Rating, attributes: ['rating'] }] }],
      order: [[allowedSort.includes(sortBy) ? sortBy : 'id', direction]],
    });

    const data = users.map((user) => {
      const plain = user.get({ plain: true });
      const ownedRatings = (plain.Stores || []).flatMap((store) => store.Ratings || []);
      const ownerRating = ownedRatings.length
        ? ownedRatings.reduce((sum, item) => sum + item.rating, 0) / ownedRatings.length
        : null;

      return {
        id: plain.id,
        name: plain.name,
        email: plain.email,
        address: plain.address,
        role: plain.role,
        ownerRating: ownerRating === null ? null : Number(ownerRating.toFixed(2)),
      };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const role = ['ADMIN', 'USER', 'OWNER'].includes(req.body.role) ? req.body.role : 'USER';

    const errors = validateUser({ name, email, password, address });
    if (errors.length) return res.status(400).json({ errors });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Rating, attributes: ['rating'] },
      ],
      order: [['id', 'ASC']],
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
        createdAt: plain.createdAt,
      };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Store, attributes: ['id', 'name', 'address'] },
      ],
      order: [['id', 'ASC']],
    });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
