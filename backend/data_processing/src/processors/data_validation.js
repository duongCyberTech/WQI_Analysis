const sensorConfigs = require("../../../iot_simulator/config/sensor_config.json");

// Hàm validate dữ liệu từ sensor
function validateSensorData(sensorData) {
  try {
    // Kiểm tra cấu trúc dữ liệu
    if (!sensorData || !sensorData.readings || !sensorData.observation_point) {
      return null;
    }

    const validatedReadings = {};
    const readings = sensorData.readings;

    // Kiểm tra từng thông số
    for (const [param, config] of Object.entries(sensorConfigs)) {
      if (readings[param] === undefined) {
        console.warn(`Missing parameter: ${param}`);
        // Gán giá trị mặc định nếu thiếu
        validatedReadings[param] = (config.min + config.max) / 2;
      } else if (
        readings[param] < config.min * 0.5 ||
        readings[param] > config.max * 1.5
      ) {
        // Nếu giá trị nằm ngoài khoảng mở rộng (cho phép sai lệch 50%)
        console.warn(
          `Value out of extended range for ${param}: ${readings[param]}`
        );
        // Cắt giá trị về trong khoảng mở rộng
        validatedReadings[param] = Math.max(
          config.min * 0.5,
          Math.min(readings[param], config.max * 1.5)
        );
      } else {
        // Giá trị hợp lệ
        validatedReadings[param] = readings[param];
      }
    }

    // Xử lý các trường Boolean
    if (readings.edwardsiella_ictaluri !== undefined) {
      validatedReadings.edwardsiella_ictaluri = readings.edwardsiella_ictaluri
        ? 1
        : 0;
    } else {
      validatedReadings.edwardsiella_ictaluri = 0;
    }

    if (readings.aeromonas_hydrophila !== undefined) {
      validatedReadings.aeromonas_hydrophila = readings.aeromonas_hydrophila
        ? 1
        : 0;
    } else {
      validatedReadings.aeromonas_hydrophila = 0;
    }

    return {
      ...sensorData,
      readings: validatedReadings,
    };
  } catch (error) {
    console.error("Error validating sensor data:", error);
    return null;
  }
}

module.exports = { validateSensorData };
