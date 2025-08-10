const express = require('express');
const router = express.Router();
const { generatePdfReportService, generateExcelReportService } = require('../services/reportService');

// Chỉ người dùng đã đăng nhập mới có thể xuất báo cáo
router.post('/generate-pdf', async (req, res) => {
  const { startDate, endDate, location } = req.body;

  try {
    const filePath = await generatePdfReportService(startDate, endDate, location);
    res.download(filePath); // Trả về file PDF
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo báo cáo PDF', details: error.message });
  }
});

router.post('/generate-excel', async (req, res) => {
  const { startDate, endDate, location } = req.body;

  try {
    const filePath = await generateExcelReportService(startDate, endDate, location);
    res.download(filePath); // Trả về file Excel
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo báo cáo Excel', details: error.message });
  }
});

module.exports = router;
