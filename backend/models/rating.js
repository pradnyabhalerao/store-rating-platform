const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define(
  'Rating',
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    indexes: [{ unique: true, fields: ['userId', 'storeId'] }],
  }
);

module.exports = Rating;
