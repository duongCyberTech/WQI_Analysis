const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Dự đoán WQI sử dụng mô hình ML
 * @param {Object} readings - Thông số đọc từ sensors
 * @returns {Promise<Object>} - Kết quả WQI và water_quality
 */
async function predictWQI(readings, locationInfo) {
  try {
    // Chuyển đổi dữ liệu thành định dạng phù hợp với API ML
    const inputData = {
      place: { 0: locationInfo.placenum || 1 },
      temperature: { 0: readings.temperature },
      pH: { 0: readings.pH },
      DO: { 0: readings.DO },
      conductivity: { 0: readings.conductivity },
      alkalinity: { 0: readings.alkalinity },
      no2: { 0: readings.no2 },
      nh4: { 0: readings.nh4 },
      po4: { 0: readings.po4 },
      h2s: { 0: readings.h2s },
      tss: { 0: readings.tss },
      cod: { 0: readings.cod },
      aeromonas_total: { 0: readings.aeromonas_total },
      edwardsiella_ictaluri: { 0: readings.edwardsiella_ictaluri },
      aeromonas_hydrophila: { 0: readings.aeromonas_hydrophila },
      coliform: { 0: readings.coliform },
      // water_quality: { 0: 3 }, // Giá trị mặc định, sẽ được thay thế bởi dự đoán
    };

    console.log(`Gửi dữ liệu đến ML service: ${JSON.stringify(inputData)}`);

    const response = await axios.post(`${ML_SERVICE_URL}/test`, inputData);

    if (response.data && response.data.prediction) {
      const wqi = response.data.prediction[0];
      const waterQuality = determineWaterQuality(wqi);
      
      return {
        wqi,
        waterQuality,
        isMLPrediction: true,
      };
    } else {
      throw new Error("ML service không trả về kết quả dự đoán");
    }
  } catch (error) {
    console.error("Lỗi khi gọi ML service:", error);

    // Fallback: Sử dụng phương pháp tính toán truyền thống nếu ML service lỗi
    // const { calculateWQI } = require("./wqi_calculator");
    // const result = calculateWQI(readings);
    // result.isMLPrediction = false;

    // return result;
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

module.exports = { predictWQI };
