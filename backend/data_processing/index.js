const { startService } = require("./src/app");

// Khởi động service
startService().catch((error) => {
  console.error("Failed to start data processing service:", error);
  process.exit(1);
});
