const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins (adjust for production)
  methods: 'PUT,GET, POST, DELETE, PATCH, OPTIONS', // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers, including Content-Type
}));
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

module.exports = app;
