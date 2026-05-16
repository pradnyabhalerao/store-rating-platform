const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const seedAdmin = require('./seeders/adminSeeder');
const seedStores = require('./seeders/storeSeeder');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await seedAdmin();
    await seedStores();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Check backend/.env and make sure MySQL is running.');
    process.exit(1);
  }
};

startServer();
