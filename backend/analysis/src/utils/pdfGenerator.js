const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const path = require('path');

// Phông chữ Times New Roman
const fontPath = path.join(__dirname, './fonts/times.ttf');

const columns = [
  { header: 'STT', key: 'stt', width: 6 },
  { header: 'Ngày', key: 'date', width: 12 },
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

const generatePdfReport = async (data) => {
  return new Promise((resolve, reject) => {
    const bufferStream = new PassThrough();
    const doc = new PDFDocument({ margin: 40, size: 'A3', layout: 'landscape' });

    const chunks = [];
    doc.pipe(bufferStream);

    bufferStream.on('data', chunk => chunks.push(chunk));
    bufferStream.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve({pdfBuffer: pdfBuffer, data: data});
    });
    bufferStream.on('error', reject);

    // === Nội dung PDF ===
    doc.font(fontPath).fontSize(20).text('BÁO CÁO CHẤT LƯỢNG NƯỚC', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Thời gian tạo: ${new Date().toLocaleString()}`);
    doc.moveDown();

    if (data.length === 0) {
      doc.text('Không có dữ liệu.');
      doc.end();
      return;
    }

    // === Vẽ bảng ===
    const tableTop = doc.y + 10;
    const rowHeight = 25;
    const columnPadding = 5;
    const xStart = 40;

    const pageWidth = doc.page.width - xStart * 2;
    const totalColumnUnit = columns.reduce((sum, col) => sum + col.width, 0);
    const columnWidths = columns.map(col => (col.width / totalColumnUnit) * pageWidth);

    let y = tableTop;
    let x = xStart;

    doc.fontSize(10).font(fontPath).fillColor('black');

    columns.forEach((col, i) => {
      doc.rect(x, y, columnWidths[i], rowHeight).stroke();
      doc.text(col.header, x + columnPadding, y + 7, {
        width: columnWidths[i] - columnPadding * 2,
        align: 'left',
      });
      x += columnWidths[i];
    });

    y += rowHeight;

    function parseTextItem(item) {
      const lines = item.text.split('\n');
      const obj = {};

      lines.forEach(line => {
        if (line.includes('Ngày:')) obj.date = line.split('Ngày:')[1].trim();
        else if (line.includes('Nhiệt độ:')) obj.temperature = parseFloat(line.split(':')[1]);
        else if (line.includes('pH:')) obj.pH = parseFloat(line.split(':')[1]);
        else if (line.includes('DO:')) obj.DO = parseFloat(line.split(':')[1]);
        else if (line.includes('Độ dẫn điện:')) obj.conductivity = parseFloat(line.split(':')[1]);
        else if (line.includes('Kiềm:')) obj.alkalinity = parseFloat(line.split(':')[1]);
        else if (line.includes('NO2:')) obj.no2 = parseFloat(line.split(':')[1]);
        else if (line.includes('NH4:')) obj.nh4 = parseFloat(line.split(':')[1]);
        else if (line.includes('PO4:')) obj.po4 = parseFloat(line.split(':')[1]);
        else if (line.includes('H2S:')) obj.h2s = parseFloat(line.split(':')[1]);
        else if (line.includes('TSS:')) obj.tss = parseFloat(line.split(':')[1]);
        else if (line.includes('COD:')) obj.cod = parseFloat(line.split(':')[1]);
        else if (line.includes('Aeromonas (tổng):')) obj.aeromonas_total = parseFloat(line.split(':')[1]);
        else if (line.includes('Edwardsiella ictaluri:')) obj.edwardsiella_ictaluri = line.split(':')[1].trim();
        else if (line.includes('Aeromonas hydrophila:')) obj.aeromonas_hydrophila = line.split(':')[1].trim();
        else if (line.includes('Coliform:')) obj.coliform = parseFloat(line.split(':')[1]);
        else if (line.includes('WQI:')) obj.wqi = parseFloat(line.split(':')[1]);
        else if (line.includes('Xếp loại nước:')) obj.water_quality = line.split(':')[1].trim();
      });

      return obj;
    }

    data = data.map(item => {
      if (item.text) return parseTextItem(item);
      return item.get ? item.get({ plain: true }) : item;
    });

    data.forEach((item, index) => {
      x = xStart;

      columns.forEach((col, i) => {
        const value = col.key === 'stt' ? index + 1 : item[col.key] ?? '';

        doc.rect(x, y, columnWidths[i], rowHeight).stroke();
        doc.text(String(value), x + columnPadding, y + 7, {
          width: columnWidths[i] - columnPadding * 2,
          align: 'left',
        });
        x += columnWidths[i];
      });

      y += rowHeight;

      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage({ size: 'A3', layout: 'landscape' });
        y = 40;

        x = xStart;
        columns.forEach((col, i) => {
          doc.rect(x, y, columnWidths[i], rowHeight).stroke();
          doc.text(col.header, x + columnPadding, y + 7, {
            width: columnWidths[i] - columnPadding * 2,
            align: 'left',
          });
          x += columnWidths[i];
        });
        y += rowHeight;
      }
    });

    doc.end();
  });
};

module.exports = generatePdfReport;
