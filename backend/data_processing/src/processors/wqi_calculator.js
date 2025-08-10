const thresholds = require("../../config/thresholds.json");
const weights = require("../../config/wqi_weights.json");

// Hàm tính giá trị WQI dựa trên các thông số
function calculateWQI(readings) {
  // Tính điểm cho từng thông số
  const scores = {};
  let totalWeight = 0;
  let weightedSum = 0;

  // Tính điểm cho từng thông số và trọng số tương ứng
  for (const [param, value] of Object.entries(readings)) {
    if (weights[param]) {
      scores[param] = calculateParameterScore(param, value);
      weightedSum += scores[param] * weights[param];
      totalWeight += weights[param];
    }
  }

  // Tính WQI cuối cùng
  const wqi = Math.round(weightedSum / totalWeight);

  // Xác định chất lượng nước
  let waterQuality = determineWaterQuality(wqi);

  return {
    wqi,
    waterQuality,
    parameterScores: scores,
  };
}

// Hàm tính điểm cho từng thông số
function calculateParameterScore(parameter, value) {
  const threshold = thresholds[parameter];
  if (!threshold) return 0;

  // Công thức tính điểm tùy thuộc vào loại thông số
  if (parameter === "DO") {
    // DO càng cao càng tốt
    if (value >= threshold.excellent) return 100;
    if (value >= threshold.good) return 80;
    if (value >= threshold.medium) return 60;
    if (value >= threshold.bad) return 40;
    return 20;
  } else {
    // Các thông số khác thường càng thấp càng tốt
    if (value <= threshold.excellent) return 100;
    if (value <= threshold.good) return 80;
    if (value <= threshold.medium) return 60;
    if (value <= threshold.bad) return 40;
    return 20;
  }
}

// Hàm xác định chất lượng nước từ điểm WQI
function determineWaterQuality(wqi) {
  if (wqi >= 90) return 1; // Rất tốt
  if (wqi >= 70) return 2; // Tốt
  if (wqi >= 50) return 3; // Trung bình
  if (wqi >= 25) return 4; // Kém
  return 5; // Rất kém
}

module.exports = { calculateWQI };
