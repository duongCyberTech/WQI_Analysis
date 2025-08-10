const Alert = require('../models/alert');
const sendEmail = require('../utils/mailer');

const checkThresholdsAndAlert = async (sensorData) => {
  const { parameter, value } = sensorData;

  const THRESHOLDS = {
    pH: [6.5, 8.5],
    turbidity: [0, 5],
    do: [5, 14]
  };

  const [min, max] = THRESHOLDS[parameter] || [];

  if (min !== undefined && (value < min || value > max)) {
    const message = `Cảnh báo: Thông số ${parameter} vượt ngưỡng! Giá trị: ${value}`;

    try {
      await sendEmail('admin@example.com', 'Cảnh báo chất lượng nước', message);

      await Alert.create({
        parameter,
        value,
        threshold: max,
        message,
        method: 'email',
        status: 'sent'
      });
    } catch (error) {
      await Alert.create({
        parameter,
        value,
        threshold: max,
        message,
        method: 'email',
        status: 'failed'
      });
    }
  }
};

module.exports = { checkThresholdsAndAlert };
