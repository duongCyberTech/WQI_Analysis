const mysql = require("mysql2/promise");
// require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "do_an_HTTT"
});

module.exports = pool;
