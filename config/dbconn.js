const mysql = require("mysql");

const dbconn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ph_db"
  });

module.exports = dbconn;