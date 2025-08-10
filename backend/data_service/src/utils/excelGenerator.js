const ExcelJS = require('exceljs');

const generateExcelReport = (data) => {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Water Quality Report');

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 10 },
      { header: 'Thông số', key: 'parameter', width: 20 },
      { header: 'Giá trị', key: 'value', width: 15 },
      { header: 'Thời gian', key: 'timestamp', width: 20 }
    ];

    data.forEach((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        parameter: item.parameter,
        value: item.value,
        timestamp: item.timestamp
      });
    });

    workbook.xlsx.writeFile('./reports/water_quality_report.xlsx')
      .then(() => {
        resolve('./reports/water_quality_report.xlsx');
      })
      .catch((error) => reject(error));
  });
};

module.exports = generateExcelReport;
