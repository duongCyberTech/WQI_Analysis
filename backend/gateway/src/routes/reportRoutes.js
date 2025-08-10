// gateway/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Xác thực người dùng
const axios = require('axios'); // Dùng axios để gọi các service khác

// API để xuất báo cáo PDF
router.post('/generate-pdf', auth(['user', 'admin']), async (req, res) => {
  const { startDate, endDate, location } = req.body;

  try {
    const response = await axios.post(
      'http://data-service:3000/generate-pdf',
      { startDate, endDate, location }
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo báo cáo PDF', details: error.message });
  }
});

// API để xuất báo cáo Excel
router.post('/generate-excel', auth(['user', 'admin']), async (req, res) => {
  const { startDate, endDate, location } = req.body;

  try {
    const response = await axios.post(
      'http://data-service:3000/generate-excel',
      { startDate, endDate, location }
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo báo cáo Excel', details: error.message });
  }
});

module.exports = router;
