const { startService } = require("./src/app");

// Start the alert service
startService().catch((error) => {
  console.error("Failed to start alert service:", error);
  process.exit(1);
});
