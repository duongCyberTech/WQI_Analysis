const os = require('os');
const osu = require('os-utils');
const sequelize = require('../services/db');

async function getSystemStats() {
  return new Promise((resolve) => {
    osu.cpuUsage(async (cpuPercent) => {
      const memTotal = os.totalmem() / 1024 / 1024;
      const memFree = os.freemem() / 1024 / 1024;
      const memUsed = memTotal - memFree;

      // Kiểm tra kết nối DB
      let dbStatus = 'connected';
      try {
        await sequelize.authenticate();
      } catch (err) {
        dbStatus = 'disconnected';
      }

      resolve({
        cpuPercent: (cpuPercent * 100).toFixed(2),
        memory: {
          totalMB: memTotal.toFixed(2),
          usedMB: memUsed.toFixed(2),
          freeMB: memFree.toFixed(2),
        },
        dbStatus,
        uptime: os.uptime(),
        loadAverage: os.loadavg(),
        timestamp: new Date()
      });
    });
  });
}

module.exports = getSystemStats;
