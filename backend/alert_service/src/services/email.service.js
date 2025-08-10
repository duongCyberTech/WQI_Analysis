const nodemailer = require("nodemailer");
const emailTemplates = require("../config/email.templates");

// Email transporter
let transporter;

/**
 * Initialize the email transporter
 */
async function initializeTransporter() {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log("Email service is ready to send messages");
    return true;
  } catch (error) {
    console.error("Failed to connect to email server:", error);
    return false;
  }
}

/**
 * Send WQI alert email
 * @param {string[]} recipients - Email recipients
 * @param {string} location - Location name
 * @param {string} coordinates - Geographic coordinates
 * @param {number} wqi - Water Quality Index value
 * @param {number} waterQuality - Water quality category (1-5)
 * @param {Object} readings - Sensor readings
 * @param {Array} anomalies - Detected anomalies
 */
async function sendWQIAlert(
  recipients,
  location,
  coordinates,
  wqi,
  waterQuality,
  readings,
  anomalies
) {
  if (!transporter) {
    console.error("Email transporter not initialized");
    return false;
  }

  // Get quality category text
  const qualityText = getWaterQualityText(waterQuality);

  // Create email content
  const emailContent = emailTemplates.generateWQIAlertTemplate(
    location,
    coordinates,
    wqi,
    qualityText,
    readings,
    anomalies
  );

  // Send email
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || "WQI Alert System <noreply@example.com>",
    to: recipients.join(", "),
    subject: `🚨 CẢNH BÁO CHẤT LƯỢNG NƯỚC: ${location} - WQI=${wqi} (${qualityText})`,
    html: emailContent,
  });
}

/**
 * Send anomaly alert email
 * @param {string[]} recipients - Email recipients
 * @param {string} location - Location name
 * @param {string} coordinates - Geographic coordinates
 * @param {Array} anomalies - Detected anomalies
 * @param {Object} readings - Sensor readings
 */
async function sendAnomalyAlert(
  recipients,
  location,
  coordinates,
  anomalies,
  readings,
  wqi = null, // Thêm tham số WQI (có thể null)
  waterQuality = null // Thêm tham số waterQuality (có thể null)
) {
  if (!transporter) {
    console.error("Email transporter not initialized");
    return false;
  }

  // Create email content với WQI
  const emailContent = emailTemplates.generateAnomalyAlertTemplate(
    location,
    coordinates,
    anomalies,
    readings,
    wqi,
    waterQuality
  );

  // Cập nhật tiêu đề có WQI nếu có
  const subject =
    wqi !== null
      ? `🚨 CẢNH BÁO KHẨN: Bất thường tại ${location} - WQI=${wqi}`
      : `🚨 CẢNH BÁO KHẨN: Phát hiện bất thường tại ${location}`;

  // Send email
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || "WQI Alert System <noreply@example.com>",
    to: recipients.join(", "),
    subject: subject,
    html: emailContent,
  });
}

/**
 * Get text description for water quality level
 * @param {number} waterQuality - Water quality category (1-5)
 * @returns {string} - Quality description
 */
function getWaterQualityText(waterQuality) {
  switch (waterQuality) {
    case 1:
      return "Rất tốt";
    case 2:
      return "Tốt";
    case 3:
      return "Trung bình";
    case 4:
      return "Kém";
    case 5:
      return "Rất kém";
    default:
      return "Không xác định";
  }
}

module.exports = {
  initializeTransporter,
  sendWQIAlert,
  sendAnomalyAlert,
  getWaterQualityText,
};
