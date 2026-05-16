const { Store } = require('../models');

const starterStores = [
  {
    name: 'Urban Basket Grocery',
    email: 'hello@urbanbasket.example',
    address: '24 Market Street, Pune, Maharashtra',
  },
  {
    name: 'Cedar & Co. Home Goods',
    email: 'support@cedarhome.example',
    address: '118 Lake View Road, Bengaluru, Karnataka',
  },
  {
    name: 'Northstar Electronics',
    email: 'care@northstarelectronics.example',
    address: '7 Tech Park Avenue, Hyderabad, Telangana',
  },
  {
    name: 'The Daily Bean Cafe',
    email: 'team@dailybean.example',
    address: '51 Central Plaza, Mumbai, Maharashtra',
  },
];

const seedStores = async () => {
  const count = await Store.count();
  if (count > 0) return;

  await Store.bulkCreate(starterStores);
  console.log('Seeded starter stores');
};

module.exports = seedStores;
