const thresholds = require("../../config/thresholds.json");

// Hàm phát hiện bất thường trong dữ liệu
function detectAnomalies(readings) {
  const anomalies = [];

  // Kiểm tra từng thông số
  for (const [param, value] of Object.entries(readings)) {
    const threshold = thresholds[param];
    if (!threshold) continue;

    // Kiểm tra các ngưỡng khác nhau
    if (param === "DO") {
      // DO càng cao càng tốt, ngược với các thông số khác
      if (value < threshold.bad) {
        anomalies.push({
          parameter: param,
          value: value,
          severity: "high",
          message: `DO quá thấp (${value} mg/L), có thể gây nguy hiểm cho sinh vật thủy sinh`,
        });
      } else if (value < threshold.medium) {
        anomalies.push({
          parameter: param,
          value: value,
          severity: "medium",
          message: `DO thấp (${value} mg/L), đang ở mức nguy hiểm`,
        });
      }
    } else {
      // Các thông số khác thường càng thấp càng tốt
      if (value > threshold.bad) {
        anomalies.push({
          parameter: param,
          value: value,
          severity: "high",
          message: `${param} quá cao (${value}), vượt ngưỡng cho phép`,
        });
      } else if (value > threshold.medium) {
        anomalies.push({
          parameter: param,
          value: value,
          severity: "medium",
          message: `${param} cao (${value}), gần ngưỡng nguy hiểm`,
        });
      }
    }
  }

  return anomalies;
}

module.exports = { detectAnomalies };
