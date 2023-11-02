const dbconn = require("../config/dbconn");

const serverGetTokens = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT expoToken FROM tbl_expotoken WHERE notification = ?";
    dbconn.query(sql, ["allow"], (err, result) => {
      if (err) {
        console.error("Error fetching tokens:", err);
        reject(err);
      } else {
        if (result?.length) {
          const tokens = result.map((res) => res.expoToken);
          resolve(tokens);
        } else {
          resolve([]);
        }
      }
    });
  });
};

const createToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ msg: "Token is missing" });

    const checkTokenSql = "SELECT * FROM tbl_expotoken WHERE expoToken=?";
    const result = await dbconn.query(checkTokenSql, [token]);
    if (result.length > 0) {
      return res.status(200).json({ msg: "Your token is already saved" });
    }

    const insertTokenSql = "INSERT INTO tbl_expotoken(expoToken, notification) VALUE(?, ?)";
    await dbconn.query(insertTokenSql, [token, "allow"]);
    res.status(200).json({ msg: "Token saved successfully" });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const notifPermission = async (req, res) => {
  try {
    const { expoToken, isOn } = req.query;
    if (!expoToken) return res.status(400).json({ msg: "Expo push token is missing" });

    const updatePermissionSql = "UPDATE tbl_expotoken SET notification = ? WHERE expoToken = ?";
    await dbconn.query(updatePermissionSql, [isOn === "true" ? "disallow" : "allow", expoToken]);
    res.status(200).json({ msg: isOn === "true" ? false : true });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  serverGetTokens,
  createToken,
  notifPermission,
};