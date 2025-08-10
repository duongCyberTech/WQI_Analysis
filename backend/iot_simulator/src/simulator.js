const { Kafka } = require("kafkajs");
const sensorConfigs = require("../config/sensor_config.json");

// Kết nối tới Kafka
const kafka = new Kafka({
  clientId: "iot-simulator",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

// Mảng chứa các điểm quan trắc từ dữ liệu thực tế
const observationPoints = [
  {
    opname: "Cầu Rạch Miễu",
    placenum: 1,
    coordinate: "10.3456,106.3456",
    district: "Quận 1",
    province: "TP.HCM",
  },
  {
    opname: "Cầu Chữ Y",
    placenum: 2,
    coordinate: "10.7511,106.7017",
    district: "Quận 4",
    province: "TP.HCM",
  },
  // Thêm các điểm quan trắc khác từ dữ liệu thực
];

// Hàm tạo giá trị ngẫu nhiên dựa trên range
function generateRandomValue(min, max) {
  return min + Math.random() * (max - min);
}

// Hàm mô phỏng dữ liệu sensor dựa trên phân bố thực tế
function simulateSensorData(sensorType) {
  const config = sensorConfigs[sensorType];
  if (!config) return null;

  return generateRandomValue(config.min, config.max);
}

// Hàm tạo dữ liệu từ tất cả sensors cho một điểm quan trắc
function generateObservationData(point) {
  const timestamp = new Date().toISOString();

  return {
    timestamp,
    observation_point: point.opname,
    place: point.placenum,
    coordinate: point.coordinate,
    district: point.district,
    province: point.province,
    readings: {
      temperature: simulateSensorData("temperature"),
      pH: simulateSensorData("pH"),
      DO: simulateSensorData("DO"),
      conductivity: simulateSensorData("conductivity"),
      alkalinity: simulateSensorData("alkalinity"),
      no2: simulateSensorData("no2"),
      nh4: simulateSensorData("nh4"),
      po4: simulateSensorData("po4"),
      h2s: simulateSensorData("h2s"),
      tss: simulateSensorData("tss"),
      cod: simulateSensorData("cod"),
      aeromonas_total: simulateSensorData("aeromonas_total"),
      edwardsiella_ictaluri: Math.random() > 0.5 ? 1 : 0,
      aeromonas_hydrophila: Math.random() > 0.5 ? 1 : 0,
      coliform: simulateSensorData("coliform"),
    },
  };
}

// Hàm gửi dữ liệu sensor lên Kafka
async function sendSensorData() {
  try {
    for (const point of observationPoints) {
      const sensorData = generateObservationData(point);

      await producer.send({
        topic: "raw-sensor-data",
        messages: [{ value: JSON.stringify(sensorData) }],
      });

      console.log(
        `Sent data for ${point.opname}: ${JSON.stringify(sensorData)}`
      );
    }
  } catch (error) {
    console.error("Error sending sensor data:", error);
  }
}

// Khởi động simulator
async function startSimulator(intervalMs = 60000) {
  // Mặc định là mỗi phút
  await producer.connect();
  console.log("Connected to Kafka. Starting IoT simulator...");

  // Gửi dữ liệu theo chu kỳ
  setInterval(sendSensorData, intervalMs);

  // Gửi dữ liệu lần đầu ngay khi khởi động
  sendSensorData();
}

module.exports = { startSimulator };

// Nếu chạy trực tiếp file này
if (require.main === module) {
  startSimulator();
}
