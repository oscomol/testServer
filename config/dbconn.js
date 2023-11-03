const mysql = require("mysql");

var dbconn = mysql.createPool({
  connectionLimit: 10,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

function handleDisconnect() {
  dbconn.getConnection(function (err, connection) {
    if (err) {
      console.log("error when getting pool connection:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Database connection established successfully");
      connection.release(); // Release the connection back to the pool
    }
  });

  dbconn.on("error", function (err) {
    console.log("pool error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = dbconn;
