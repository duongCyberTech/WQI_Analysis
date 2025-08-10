/**
 * Generate HTML template for WQI alert emails
 */
function generateWQIAlertTemplate(
  location,
  coordinates,
  wqi,
  qualityText,
  readings,
  anomalies
) {
  // Get color based on WQI
  const wqiColor = getWQIColor(wqi);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f0f0f0; padding: 10px; text-align: center; }
        .alert-badge { 
          display: inline-block; 
          background-color: ${wqiColor}; 
          color: white; 
          padding: 5px 10px; 
          border-radius: 4px; 
          font-weight: bold;
        }
        .section { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
        .map-link { color: #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Cảnh báo chất lượng nước</h2>
        </div>
        
        <div class="section">
          <h3>Thông tin điểm quan trắc</h3>
          <p><strong>Địa điểm:</strong> ${location}</p>
          <p><strong>Tọa độ:</strong> <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${coordinates}" target="_blank">${coordinates}</a></p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString(
            "vi-VN"
          )}</p>
        </div>
        
        <div class="section">
  <h3>Chỉ số chất lượng nước (WQI)</h3>
  <p style="font-size: 24px; text-align: center;">
    <span class="alert-badge" style="font-size: 36px; padding: 10px 20px;">${wqi}</span>
  </p>
  <p style="text-align: center; font-size: 18px; margin-top: 10px;">
    <strong>${qualityText}</strong>
  </p>
  <p>Chỉ số WQI hiện tại nằm ở mức RẤT KÉM (dưới 25), cho thấy chất lượng nước đang ở mức nguy hiểm.</p>
  <div style="border: 2px dashed #dc3545; padding: 10px; margin-top: 15px; background-color: #fff8f8;">
    <p style="margin: 0"><strong>Ý nghĩa:</strong> Nước ô nhiễm nặng, không thích hợp cho hầu hết các mục đích sử dụng, 
    cần có biện pháp khắc phục khẩn cấp.</p>
  </div>
</div>
        
        <div class="section">
          <h3>Thông số đo được</h3>
          <table>
            <tr>
              <th>Thông số</th>
              <th>Giá trị</th>
              <th>Đơn vị</th>
            </tr>
            ${generateReadingsTable(readings)}
          </table>
        </div>
        
        ${
          anomalies && anomalies.length > 0
            ? `
        <div class="section">
          <h3>Bất thường phát hiện</h3>
          <ul>
            ${anomalies
              .map(
                (a) => `<li><strong>${a.parameter}:</strong> ${a.message}</li>`
              )
              .join("")}
          </ul>
        </div>
        `
            : ""
        }
        
        <div class="section">
          <h3>Hành động đề xuất</h3>
          <ul>
            <li>Kiểm tra lại các thông số bất thường</li>
            <li>Tăng tần suất quan trắc tại điểm này</li>
            <li>Thực hiện các biện pháp kiểm soát nguồn ô nhiễm</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống giám sát chất lượng nước WQI_Analysis.</p>
          <p>© ${new Date().getFullYear()} WQI Monitoring System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML template for anomaly alert emails
 */
// Thay đổi hàm generateAnomalyAlertTemplate để nhận thêm tham số WQI và waterQuality
function generateAnomalyAlertTemplate(
  location,
  coordinates,
  anomalies,
  readings,
  wqi = null, // Thêm tham số WQI (có thể null)
  waterQuality = null // Thêm tham số waterQuality (có thể null)
) {
  // Xác định màu WQI nếu có
  const wqiColor = wqi ? getWQIColor(wqi) : "#dc3545";
  const qualityText = waterQuality
    ? getWaterQualityText(waterQuality)
    : "Không xác định";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8d7da; padding: 10px; text-align: center; }
        .alert-badge { 
          display: inline-block; 
          background-color: ${wqiColor}; 
          color: white; 
          padding: 5px 10px; 
          border-radius: 4px; 
          font-weight: bold;
        }
        .section { margin: 20px 0; }
        .anomaly { 
          padding: 10px; 
          margin-bottom: 10px; 
          background-color: #fff3cd; 
          border-left: 4px solid #ffc107; 
        }
        .anomaly.high { 
          background-color: #f8d7da; 
          border-left: 4px solid #dc3545; 
        }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
        .map-link { color: #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Cảnh báo bất thường chất lượng nước</h2>
        </div>
        
        <div class="section">
          <h3>Thông tin điểm quan trắc</h3>
          <p><strong>Địa điểm:</strong> ${location}</p>
          <p><strong>Tọa độ:</strong> <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${coordinates}" target="_blank">${coordinates}</a></p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString(
            "vi-VN"
          )}</p>
        </div>
        
        ${
          wqi !== null
            ? `
        <div class="section">
          <h3>Chỉ số chất lượng nước (WQI)</h3>
          <p style="font-size: 20px; text-align: center;">
            <span class="alert-badge" style="font-size: 28px; padding: 8px 16px;">${wqi}</span>
          </p>
          <p style="text-align: center; font-size: 16px; margin-top: 8px;">
            <strong>${qualityText}</strong>
          </p>
        </div>
        `
            : ""
        }
        
        <div class="section">
          <h3>Các bất thường đã phát hiện</h3>
          ${anomalies
            .map(
              (a) => `
            <div class="anomaly ${a.severity}">
              <h4>${a.parameter}</h4>
              <p>${a.message}</p>
              <p><strong>Giá trị đo được:</strong> ${a.value}</p>
              <p><strong>Mức độ:</strong> ${getSeverityText(a.severity)}</p>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="section">
          <h3>Hành động khẩn cấp đề xuất</h3>
          <ul>
            <li>Kiểm tra lại ngay các nguồn ô nhiễm xung quanh</li>
            <li>Thu thập mẫu bổ sung để xác nhận kết quả</li>
            <li>Thông báo cho các cơ quan chức năng liên quan</li>
            <li>Áp dụng các biện pháp xử lý khẩn cấp</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống giám sát chất lượng nước WQI_Analysis.</p>
          <p>© ${new Date().getFullYear()} WQI Monitoring System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML table rows for sensor readings
 * @param {Object} readings - Sensor readings
 * @returns {string} - HTML table rows
 */
function generateReadingsTable(readings) {
  const units = {
    temperature: "°C",
    pH: "",
    DO: "mg/L",
    conductivity: "μS/cm",
    alkalinity: "mg/L",
    no2: "mg/L",
    nh4: "mg/L",
    po4: "mg/L",
    h2s: "mg/L",
    tss: "mg/L",
    cod: "mg/L",
    aeromonas_total: "CFU/mL",
    coliform: "MPN/100mL",
  };

  const parameterNames = {
    temperature: "Nhiệt độ",
    pH: "pH",
    DO: "Oxygen hòa tan (DO)",
    conductivity: "Độ dẫn điện",
    alkalinity: "Độ kiềm",
    no2: "Nitrite (NO₂)",
    nh4: "Ammonium (NH₄)",
    po4: "Phosphate (PO₄)",
    h2s: "Hydrogen Sulfide (H₂S)",
    tss: "Tổng chất rắn lơ lửng (TSS)",
    cod: "Nhu cầu oxy hóa học (COD)",
    aeromonas_total: "Aeromonas tổng số",
    coliform: "Coliform",
  };

  let tableRows = "";

  for (const [param, value] of Object.entries(readings)) {
    if (param === "edwardsiella_ictaluri" || param === "aeromonas_hydrophila") {
      tableRows += `
        <tr>
          <td>${parameterNames[param] || param}</td>
          <td>${value ? "Có" : "Không"}</td>
          <td></td>
        </tr>
      `;
    } else if (units[param]) {
      tableRows += `
        <tr>
          <td>${parameterNames[param] || param}</td>
          <td>${value}</td>
          <td>${units[param]}</td>
        </tr>
      `;
    }
  }

  return tableRows;
}

/**
 * Get background color based on WQI value
 * @param {number} wqi - WQI value
 * @returns {string} - Color code
 */
function getWQIColor(wqi) {
  if (wqi >= 90) return "#28a745"; // Green
  if (wqi >= 70) return "#5cb85c"; // Light green
  if (wqi >= 50) return "#ffc107"; // Yellow
  if (wqi >= 25) return "#fd7e14"; // Orange
  return "#dc3545"; // Red
}

/**
 * Get text for severity level
 * @param {string} severity - Severity level
 * @returns {string} - Severity text in Vietnamese
 */
function getSeverityText(severity) {
  switch (severity) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return "Không xác định";
  }
}

module.exports = {
  generateWQIAlertTemplate,
  generateAnomalyAlertTemplate,
};
