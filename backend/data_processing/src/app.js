const { Kafka } = require("kafkajs");
const { calculateWQI } = require("./processors/wqi_calculator");
const { validateSensorData } = require("./processors/data_validation");
const { detectAnomalies } = require("./processors/anomaly_detector");
const { predictWQI } = require("./processors/ml_predictor");
const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "do_an_HTTT",
  port: 3306
});

// Kết nối đến Kafka
const kafka = new Kafka({
  clientId: "data-processing-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "data-processor-group" });
const producer = kafka.producer();

// Hàm xử lý message từ Kafka
async function processMessage(message) {
  try {
    const sensorData = JSON.parse(message.value.toString());
    console.log(`Processing data for ${sensorData.observation_point}`);

    // Bước 1: Validate dữ liệu
    const validatedData = validateSensorData(sensorData);
    if (!validatedData) {
      console.error("Invalid sensor data:", sensorData);
      return;
    }

    console.log("Validated Data ", validatedData);
    // Bước 2: Dự đoán WQI bằng ML model
    const locationInfo = {
      placenum: validatedData.place,
      opname: validatedData.observation_point,
    };

    const wqiResult = await predictWQI(validatedData.readings, locationInfo);

    // Bước 3: Phát hiện bất thường
    const anomalies = detectAnomalies(validatedData.readings);

    // Kết hợp dữ liệu
    const processedData = {
      ...validatedData,
      wqi: wqiResult.wqi,
      water_quality: wqiResult.waterQuality,
      anomalies: anomalies,
    };
    console.log("WQI result:", wqiResult);
    const mysqlDateOnly = new Date(validatedData.timestamp).toISOString().slice(0, 10);
    // Lưu vào database (nếu cần)
    await pool.query(`INSERT INTO alldata(place, observation_point, province, district, coordinate, date, temperature, pH, DO, conductivity, alkalinity, no2, nh4, po4, h2s, tss, cod,
      aeromonas_total, edwardsiella_ictaluri, aeromonas_hydrophila, coliform, wqi, water_quality) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
      [validatedData.place, validatedData.observation_point, validatedData.province, validatedData.district, validatedData.coordinate,
      mysqlDateOnly, validatedData.readings.temperature, validatedData.readings.pH, validatedData.readings.DO,
      validatedData.readings.conductivity, validatedData.readings.alkalinity, validatedData.readings.no2, validatedData.readings.nh4,
      validatedData.readings.po4, validatedData.readings.h2s, validatedData.readings.tss, validatedData.readings.cod,
      validatedData.readings.aeromonas_total, validatedData.readings.edwardsiella_ictaluri, validatedData.readings.aeromonas_hydrophila, validatedData.readings.coliform, 
      wqiResult.wqi, wqiResult.waterQuality]);
    // Bước 4: Gửi dữ liệu đã xử lý vào topic khác
    await producer.send({
      topic: "processed-data",
      messages: [{ value: JSON.stringify(processedData) }],
    });

    // Nếu có bất thường, gửi cảnh báo
    if (anomalies.length > 0) {
      const alertData = {
        timestamp: validatedData.timestamp,
        observation_point: validatedData.observation_point,
        coordinate: validatedData.coordinate,
        anomalies: anomalies,
        readings: validatedData.readings,
        wqi: wqiResult.wqi, // Thêm WQI vào dữ liệu cảnh báo
        water_quality: wqiResult.waterQuality, // Thêm phân loại chất lượng nước
        alert_type: "anomaly",
      };

      await producer.send({
        topic: "water-quality-alerts",
        messages: [{ value: JSON.stringify(alertData) }],
      });
      console.log(
        `Phát hiện ${anomalies.length} bất thường tại ${validatedData.observation_point}`
      );
    }
    // Thêm kiểm tra WQI thấp và gửi cảnh báo
    const WQI_THRESHOLD = 25; // Có thể đưa vào biến môi trường
    if (wqiResult.wqi < WQI_THRESHOLD) {
      // Ngưỡng WQI xấu
      const poorWQIAlert = {
        timestamp: validatedData.timestamp,
        observation_point: validatedData.observation_point,
        coordinate: validatedData.coordinate,
        anomalies: [], // Có thể là mảng rỗng nếu không có bất thường cụ thể
        readings: validatedData.readings,
        wqi: wqiResult.wqi,
        water_quality: wqiResult.waterQuality,
        alert_type: "poor_wqi", // Đánh dấu loại cảnh báo
      };

      await producer.send({
        topic: "water-quality-alerts",
        messages: [{ value: JSON.stringify(poorWQIAlert) }],
      });

      console.log(
        `Cảnh báo WQI thấp (${wqiResult.wqi}) tại ${validatedData.observation_point}`
      );
    }

    console.log(
      `Processed data for ${sensorData.observation_point}. WQI: ${wqiResult.wqi}`
    );
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

// Khởi động service
async function startService() {
  // Kết nối producer và consumer
  await producer.connect();
  await consumer.connect();

  // Subscribe đến topic dữ liệu thô
  await consumer.subscribe({ topic: "raw-sensor-data", fromBeginning: true });

  // Bắt đầu xử lý message
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processMessage(message);
    },
  });

  console.log("Data Processing Service started successfully");
}

// Xử lý tắt service
process.on("SIGINT", async () => {
  await consumer.disconnect();
  await producer.disconnect();
  process.exit(0);
});

// Khởi động nếu chạy trực tiếp file này
if (require.main === module) {
  startService().catch(console.error);
}

// async function saveToDatabase(data) {
//   try {
//     // Tìm opid từ observe_place
//     const [opRows] = await pool.query(
//       'SELECT opid FROM observe_place WHERE opname = ? AND placenum = ? LIMIT 1',
//       [data.observation_point, data.place]
//     );

//     if (opRows.length === 0) {
//       console.error(`Không tìm thấy observe_place cho điểm ${data.observation_point}, ${data.place}`);
//       return;
//     }

//     const opid = opRows[0].opid;
//     const date = new Date(data.timestamp).toISOString().split('T')[0];

//     // Thêm vào bảng observation
//     await pool.query(
//       `INSERT INTO observation
//         (date, temperature, pH, DO, conductivity, alkalinity, no2, nh4, po4, h2s, tss, cod,
//         aeromonas_total, edwardsiella_ictaluri, aeromonas_hydrophila, coliform, wqi, water_quality, opid)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         date,
//         data.readings.temperature,
//         data.readings.pH,
//         data.readings.DO,
//         data.readings.conductivity,
//         data.readings.alkalinity,
//         data.readings.no2,
//         data.readings.nh4,
//         data.readings.po4,
//         data.readings.h2s,
//         data.readings.tss,
//         data.readings.cod,
//         data.readings.aeromonas_total,
//         data.readings.edwardsiella_ictaluri,
//         data.readings.aeromonas_hydrophila,
//         data.readings.coliform,
//         data.wqi,
//         data.water_quality,
//         opid
//       ]
//     );

//     console.log(`Đã lưu dữ liệu cho ${data.observation_point} vào database`);
//   } catch (error) {
//     console.error('Lỗi khi lưu vào database:', error);
//     throw error;
//   }
// }

module.exports = { startService };
