require("dotenv").config();
const { Kafka } = require("kafkajs");
const emailService = require("./services/email.service");

// Configure Kafka
const kafka = new Kafka({
  clientId: "alert-service",
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(",")
    : ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "alert-service-group" });

// WQI threshold for alerts (default: 50)
const WQI_THRESHOLD = parseInt(process.env.WQI_THRESHOLD || "25");

// Process messages from Kafka
// Process messages from Kafka
async function processMessage(message) {
  try {
    const alertData = JSON.parse(message.value.toString());
    console.log(`Processing alert for ${alertData.observation_point}`);

    // Check if WQI is below threshold - VẪN GIỮ phần gửi email khi WQI thấp
    if (alertData.wqi && alertData.wqi < WQI_THRESHOLD) {
      console.log(
        `Low WQI detected (${alertData.wqi}) at ${alertData.observation_point}. Sending email alert.`
      );

      // Prepare recipient list
      const recipients = process.env.ALERT_RECIPIENTS
        ? process.env.ALERT_RECIPIENTS.split(",")
        : ["admin@example.com"];

      // Send email alert
      await emailService.sendWQIAlert(
        recipients,
        alertData.observation_point,
        alertData.coordinate,
        alertData.wqi,
        alertData.water_quality,
        alertData.readings,
        alertData.anomalies
      );

      console.log(`Email alert sent for ${alertData.observation_point}`);
    }

    // Process specific anomalies - CHỈ LOG ra terminal không gửi email
    if (alertData.anomalies && alertData.anomalies.length > 0) {
      const criticalAnomalies = alertData.anomalies.filter(
        (a) => a.severity === "high"
      );

      if (criticalAnomalies.length > 0) {
        // Thay thế việc gửi email bằng việc log chi tiết hơn về các bất thường
        console.log(
          `CRITICAL ANOMALIES DETECTED at ${alertData.observation_point}:`
        );

        // Log từng bất thường nghiêm trọng
        criticalAnomalies.forEach((anomaly) => {
          console.log(
            `  • ${anomaly.parameter}: ${anomaly.value} - ${anomaly.message}`
          );
        });

        // Log thêm WQI nếu có
        if (alertData.wqi) {
          const qualityText = alertData.water_quality
            ? emailService.getWaterQualityText(alertData.water_quality)
            : "Không xác định";
          console.log(`  • Current WQI: ${alertData.wqi} (${qualityText})`);
        }

        console.log(
          `  • Location: ${alertData.observation_point} (${alertData.coordinate})`
        );
        console.log(
          `  • Timestamp: ${
            new Date(alertData.timestamp).toLocaleString("vi-VN") ||
            new Date().toLocaleString("vi-VN")
          }`
        );
      }
    }
  } catch (error) {
    console.error("Error processing alert message:", error);
  }
}

// Start alert service
async function startService() {
  try {
    // Initialize email service
    await emailService.initializeTransporter();

    // Connect Kafka consumer
    await consumer.connect();

    // Subscribe to water quality alerts topic
    await consumer.subscribe({
      topic: "water-quality-alerts",
      fromBeginning: true,
    });

    // Process messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await processMessage(message);
      },
    });

    console.log("Alert Service started successfully");
  } catch (error) {
    console.error("Error starting alert service:", error);
    throw error;
  }
}

// Handle shutdown
process.on("SIGINT", async () => {
  await consumer.disconnect();
  process.exit(0);
});

module.exports = { startService };
