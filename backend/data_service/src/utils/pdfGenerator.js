const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePdfReport = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = './reports/water_quality_report.pdf';

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Báo cáo chất lượng nước', { align: 'center' });
    doc.fontSize(12).text(`Thời gian: ${new Date().toLocaleString()}`);
    
    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.parameter}: ${item.value} - ${item.timestamp}`);
    });

    doc.end();
    resolve(filePath);
  });
};

module.exports = generatePdfReport;
