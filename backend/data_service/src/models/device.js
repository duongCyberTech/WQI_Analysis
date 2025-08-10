const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const Device = sequelize.define('Device', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sensorType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specs: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'devices',
  timestamps: true
});

module.exports = Device;
