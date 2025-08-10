const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/api/admin', adminRoutes);

const deviceRoutes = require('./routes/deviceRoutes');
app.use('/api/devices', deviceRoutes);

const monitorRoutes = require('./routes/monitorRoutes');
app.use('/api/monitor', monitorRoutes);

const alertRoutes = require('./routes/alertRoutes');
app.use('/api/alerts', alertRoutes);

module.exports = app;
