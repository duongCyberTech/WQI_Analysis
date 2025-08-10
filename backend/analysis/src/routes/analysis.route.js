const AnalysisController = require('../controllers/analysis.controller');
const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const fs = require('fs');
const pool = require('../config/db.js');

router.get('/nb_of_observation_points', AnalysisController.nb_of_observation_points);
router.get('/nb_of_observations', AnalysisController.nb_of_observations);
router.get('/valid_quality', AnalysisController.valid_quality);
router.get('/water_quality', AnalysisController.water_quality);
router.get('/map', AnalysisController.Place_data);
router.get('/observe', AnalysisController.getObservationAt);
router.get('/fetch', AnalysisController.getDataSet)
router.post('/insert', AnalysisController.postNewRecord)
router.get('/feature', AnalysisController.getClusterNumeric)
const PDFDocument = require('pdfkit');
require('pdfkit-table'); // Thêm table method vào PDFDocument prototype
const path = require('path');
const { PassThrough } = require('stream');

router.get('/export/excel', async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM alldata");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Export');
  
      // Set column headers
      const headers = Object.keys(rows[0] || {});
      worksheet.columns = headers.map(header => ({ header, key: header }));
  
      // Add rows to the worksheet
      rows.forEach(row => {
        worksheet.addRow(row);
      });
  
      // Set response headers for Excel file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=data_export.xlsx');
  
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error('Excel Export Error:', err);
      res.status(500).send('Export failed');
    }
  }
)


module.exports = router;