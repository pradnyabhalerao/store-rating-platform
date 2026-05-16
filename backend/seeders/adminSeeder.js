const bcrypt = require('bcryptjs');
const { User } = require('../models');

const seedAdmin = async () => {
  const exists = await User.findOne({ where: { role: 'ADMIN' } });
  if (!exists) {
    const hashed = await bcrypt.hash('Admin@123!', 10);
    await User.create({
      name: 'System Administrator Account',
      email: 'admin@example.com',
      password: hashed,
      role: 'ADMIN',
      address: 'Headquarters',
    });
    console.log('Seeded admin user');
  }
};

module.exports = seedAdmin;
