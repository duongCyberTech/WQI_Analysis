const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const Alert = sequelize.define('Alert', {
  parameter: DataTypes.STRING,
  value: DataTypes.FLOAT,
  threshold: DataTypes.FLOAT,
  status: { type: DataTypes.STRING, defaultValue: 'new' }, // new, sent, failed
  method: DataTypes.STRING, // email, sms, popup
  message: DataTypes.STRING
});

module.exports = Alert;
