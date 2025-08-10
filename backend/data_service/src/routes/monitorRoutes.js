const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const getSystemStats = require('../utils/systemMonitor');

// Chỉ admin mới có quyền xem thống kê hệ thống
router.get('/status', auth(['admin']), async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Không thể lấy thông tin hệ thống', details: error.message });
  }
});

module.exports = router;
