const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "do_an_HTTT",
  port: 3306
});

module.exports = pool;
