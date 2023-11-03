const { promisify } = require('util');
const dbconn = require('../config/dbconn');
const resetId = require('./IdsController');

const query = promisify(dbconn.query).bind(dbconn);

const getPh = async (req, res) => {
  try {
    const sql = 'SELECT * FROM tbl_ph';
    const result = await query(sql);
    res.status(200).json(result.reverse());
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getRecentPh = async (req, res) => {
  try {
    const sql = 'SELECT * FROM tbl_ph ORDER BY id DESC LIMIT 3';
    const result = await query(sql);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getByDate = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) return res.status(400).json({ msg: 'Some fields are missing' });
    const formatted = date.replace(/-/g, '/');
    const sql = 'SELECT * FROM tbl_ph WHERE date LIKE ?';
    const result = await query(sql, [`%${formatted}%`]);
    res.status(200).json(result.reverse());
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};


const savePh = async (ph, res) => {
    try {
        const sql = "INSERT INTO tbl_ph (date, ph) VALUE(?,?)";
        await dbconn.query(sql, [new Date().toLocaleString(), ph], (err, result) => {
          if(err) {
            console.log("Error saving ph: " + err)
            throw err;
          }
          res.status(200).send("Success")
        });
    } catch (error) {
        // Consider using a logging library like Winston to handle errors effectively
        console.error("Error saving pH:", error);
        // You might want to throw the error here depending on your application's error handling strategy
        // throw error;
    }
};


const deletePh = async (req, res) => {
  try {
    const { IDs } = req.query;

    if (!Array.isArray(IDs) || !IDs?.length)  return res.status(400).json({ msg: 'Some fields are missing' });

    if (IDs[0] === 'all') {
      const sql = 'DELETE FROM tbl_ph';
      await query(sql);
    } else {
      for (let x = 0; x < IDs.length; x++) {
        const sql = 'DELETE FROM tbl_ph WHERE id = ?';
        await query(sql, [IDs[x]]);
      }
    }

    const maxId = 'SELECT MAX(id) as max_id FROM tbl_ph';
    const reset = 'ALTER TABLE tbl_ph AUTO_INCREMENT = ?';
    await resetId(maxId, reset); // Changed the function name here

    res.status(200).json({ msg: 'Deleted' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getPh, deletePh, getRecentPh, getByDate, savePh };
