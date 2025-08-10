const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');
const auth = require('../middlewares/auth');

// Lấy danh sách cảnh báo (chỉ admin)
router.get('/', auth(['admin']), async (req, res) => {
  const alerts = await Alert.findAll({ order: [['createdAt', 'DESC']] });
  res.json(alerts);
});

// API test thêm cảnh báo (hoặc tích hợp trong xử lý sensor data)
router.post('/test', async (req, res) => {
  const { parameter, value } = req.body;
  const { checkThresholdsAndAlert } = require('../services/alertService');
  await checkThresholdsAndAlert({ parameter, value });
  res.json({ message: 'Đã xử lý dữ liệu' });
});

module.exports = router;
