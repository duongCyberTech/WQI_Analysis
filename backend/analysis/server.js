const app = require("./src/app");
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(3002, () => {
  console.log("Analysis service is running on port", 3002);
});
