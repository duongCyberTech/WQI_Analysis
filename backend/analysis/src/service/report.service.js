const pool = require('../config/db'); // Kết nối MySQL
const generatePdfReport = require('../utils/pdfGenerator');
const generateExcelReport = require('../utils/excelGenerator');

// Truy vấn dữ liệu từ bảng observation
async function generateReportData(startDate, endDate) {

  const query = `
    SELECT *
    FROM alldata
    WHERE date BETWEEN ? AND ?
    ORDER BY date ASC
  `;

  const [rows] = await pool.execute(query, [startDate || '2022/02/02', endDate || '2026/01/01']);
  return rows;
}

// Xuất PDF
async function generatePdfReportService(startDate, endDate) {
  const data = await generateReportData(startDate, endDate);
  //console.log("Service layer: ", data)
  const formatted = data.map(item => ({
    text:
      `Ngày: ${new Date(item.date).toLocaleDateString('vi-VN')}\n` +
      `- Nhiệt độ: ${item.temperature}\n` +
      `- pH: ${item.pH}\n` +
      `- DO: ${item.DO}\n` +
      `- Độ dẫn điện: ${item.conductivity}\n` +
      `- Kiềm: ${item.alkalinity}\n` +
      `- NO2: ${item.no2}\n` +
      `- NH4: ${item.nh4}\n` +
      `- PO4: ${item.po4}\n` +
      `- H2S: ${item.h2s}\n` +
      `- TSS: ${item.tss}\n` +
      `- COD: ${item.cod}\n` +
      `- Aeromonas (tổng): ${item.aeromonas_total}\n` +
      `- Edwardsiella ictaluri: ${item.edwardsiella_ictaluri ? 'Có' : 'Không'}\n` +
      `- Aeromonas hydrophila: ${item.aeromonas_hydrophila ? 'Có' : 'Không'}\n` +
      `- Coliform: ${item.coliform}\n` +
      `- WQI: ${item.wqi}\n` +
      `- Xếp loại nước: ${item.water_quality}`
  }));

  const filePath = await generatePdfReport(formatted);
  return filePath;
}

// Xuất Excel
async function generateExcelReportService(startDate, endDate) {
  const data = await generateReportData(startDate, endDate);

  const formatted = data.map(item => ({
    stt: item.id,
    date: new Date(item.date).toLocaleDateString('vi-VN'),
    opid: item.opid,
    temperature: item.temperature || 'N/A',
    pH: item.pH || 'N/A',
    DO: item.DO || 'N/A',
    conductivity: item.conductivity || 'N/A',
    alkalinity: item.alkalinity || 'N/A',
    no2: item.no2 || 'N/A',
    nh4: item.nh4 || 'N/A',
    po4: item.po4 || 'N/A',
    h2s: item.h2s || 'N/A',
    tss: item.tss || 'N/A',
    cod: item.cod || 'N/A',
    aeromonas_total: item.aeromonas_total || 'N/A',
    edwardsiella_ictaluri: item.edwardsiella_ictaluri ? 'Có' : 'Không',
    aeromonas_hydrophila: item.aeromonas_hydrophila ? 'Có' : 'Không',
    coliform: item.coliform || 'N/A',
    wqi: item.wqi || 'N/A',
    water_quality: item.water_quality || 'N/A',
  }));

  const filePath = await generateExcelReport(formatted);
  return filePath;
}

module.exports = {
  generateReportData,
  generatePdfReportService,
  generateExcelReportService
};
