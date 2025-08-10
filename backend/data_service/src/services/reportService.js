const { Op } = require('sequelize');
const Observation = require('../models/Observation');
const generateExcelReport = require('../utils/excelGenerator');
const generatePdfReport = require('../utils/pdfGenerator');

// Lấy dữ liệu báo cáo từ bảng observation
const generateReportData = async (startDate, endDate, location) => {
  return await Observation.findAll({
    where: {
      date: {
        [Op.between]: [startDate, endDate]
      },
      opid: location // Điều chỉnh nếu location cần ánh xạ tới observation_place
    }
  });
};

// Xuất báo cáo PDF
const generatePdfReportService = async (startDate, endDate, location) => {
  const data = await generateReportData(startDate, endDate, location);
  return await generatePdfReport(data);
};

// Xuất báo cáo Excel
const generateExcelReportService = async (startDate, endDate, location) => {
  const data = await generateReportData(startDate, endDate, location);
  return await generateExcelReport(data);
};

module.exports = { generatePdfReportService, generateExcelReportService };
