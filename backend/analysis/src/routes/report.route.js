const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { generatePdfReportService, generateExcelReportService } = require('../service/report.service');

// Gửi file PDF dưới dạng buffer
router.post('/generate-pdf', async (req, res) => {
    const { startDate, endDate } = req.query;
  
    try {
      const pdfBuffer = await generatePdfReportService(startDate, endDate); // đây là buffer
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=bao_cao_chat_luong_nuoc.pdf');
      res.send(pdfBuffer.pdfBuffer); // gửi buffer trực tiếp
      //res.status(200).json({data: pdfBuffer.data})
    } catch (error) {
      console.error('Lỗi khi tạo báo cáo PDF:', error);
      res.status(500).json({ error: 'Không thể tạo báo cáo PDF', details: error.message });
    }
  });

// Gửi file Excel dưới dạng buffer
router.post('/generate-excel', async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const filePath = await generateExcelReportService(startDate, endDate);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'inline; filename=water_quality_report.xlsx');
    res.send(filePath);
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo Excel:', error);
    res.status(500).json({ error: 'Không thể tạo báo cáo Excel', details: error.message });
  }
});

module.exports = router;
