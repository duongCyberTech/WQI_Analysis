// utils/excelGenerator.js

const ExcelJS = require('exceljs');

const generateExcelReport = async (data) => {
  // Tạo Workbook và Worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Water Quality');

  // Định nghĩa cột
  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 6 },
    { header: 'Ngày', key: 'date', width: 12 },
    { header: 'Địa điểm (opid)', key: 'opid', width: 12 },
    { header: 'Nhiệt độ', key: 'temperature', width: 12 },
    { header: 'pH', key: 'pH', width: 8 },
    { header: 'DO', key: 'DO', width: 8 },
    { header: 'Độ dẫn điện', key: 'conductivity', width: 14 },
    { header: 'Kiềm', key: 'alkalinity', width: 10 },
    { header: 'NO₂', key: 'no2', width: 10 },
    { header: 'NH₄', key: 'nh4', width: 10 },
    { header: 'PO₄', key: 'po4', width: 10 },
    { header: 'H₂S', key: 'h2s', width: 10 },
    { header: 'TSS', key: 'tss', width: 10 },
    { header: 'COD', key: 'cod', width: 10 },
    { header: 'Aeromonas tổng', key: 'aeromonas_total', width: 14 },
    { header: 'Edwardsiella', key: 'edwardsiella_ictaluri', width: 14 },
    { header: 'Aeromonas hydrophila', key: 'aeromonas_hydrophila', width: 18 },
    { header: 'Coliform', key: 'coliform', width: 12 },
    { header: 'WQI', key: 'wqi', width: 8 },
    { header: 'Chất lượng nước', key: 'water_quality', width: 16 },
  ];

  // Thêm dữ liệu vào worksheet
  data.forEach((item, index) => {
    worksheet.addRow({
      stt: index + 1,
      date: item.date,
      opid: item.opid,
      temperature: item.temperature,
      pH: item.pH,
      DO: item.DO,
      conductivity: item.conductivity,
      alkalinity: item.alkalinity,
      no2: item.no2,
      nh4: item.nh4,
      po4: item.po4,
      h2s: item.h2s,
      tss: item.tss,
      cod: item.cod,
      aeromonas_total: item.aeromonas_total,
      edwardsiella_ictaluri: item.edwardsiella_ictaluri,
      aeromonas_hydrophila: item.aeromonas_hydrophila,
      coliform: item.coliform,
      wqi: item.wqi,
      water_quality: item.water_quality,
    });
  });

  // Viết workbook ra buffer và trả về
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = generateExcelReport;
