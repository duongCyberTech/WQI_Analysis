const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const adminProxy = require('./routes/adminProxy');
app.use('/api', adminProxy);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/report', reportRoutes); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
module.exports = app;
