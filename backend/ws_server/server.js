const { Kafka } = require("kafkajs");
const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Express server
const app = express();
app.use(cors());
app.use(express.json());

// HTTP server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Kết nối Kafka
const kafka = new Kafka({
  clientId: "ws-server",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "ws-group" });

// Danh sách các clients đang kết nối
const clients = new Set();

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  // Gửi dữ liệu mới nhất khi client kết nối
  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Connected to WQI monitoring system",
    })
  );

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Kafka consumer để lấy dữ liệu real-time
async function startKafkaConsumer() {
  try {
    await consumer.connect();
    console.log("Connected to Kafka");

    await consumer.subscribe({ topic: "processed-data", fromBeginning: false });
    console.log("Subscribed to topic: processed-data");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(
            `Received message from Kafka topic: ${topic}, partition: ${partition}`
          );
          const data = JSON.parse(message.value.toString());
          console.log(
            `Data for: ${data.observation_point || "unknown location"}, WQI: ${
              data.wqi || "N/A"
            }`
          );

          // Broadcast đến tất cả clients
          const wsData = {
            type: "sensor_data",
            timestamp: new Date().toISOString(),
            data: data,
          };

          console.log(`Broadcasting to ${clients.size} connected clients`);

          let sentCount = 0;
          for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(wsData));
              sentCount++;
            }
          }
          console.log(`Successfully sent to ${sentCount} clients`);
        } catch (error) {
          console.error("Error processing Kafka message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
}

// Khởi động server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`WebSocket Server đang chạy tại http://localhost:${PORT}`);
  startKafkaConsumer().catch(console.error);
});
app.get("/", (req, res) => {
  res.send("WebSocket Server is running");
});
// Xử lý tắt server
process.on("SIGINT", async () => {
  for (const client of clients) {
    client.close();
  }
  await consumer.disconnect();
  process.exit(0);
});
