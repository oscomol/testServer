const dbconn = require("../config/dbconn");

const resetId = async (maxId, reset) => {
    try {
        const maxIdResult = await new Promise((resolve, reject) => {
            dbconn.query(maxId, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (maxIdResult.length > 0) {
            const nextId = maxIdResult[0].max_id + 1;

            // Reset the auto-increment value
            await new Promise((resolve, reject) => {
                dbconn.query(reset, [nextId], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        } else {
            console.log('No records found in the table.');
        }
    } catch (error) {
        console.error('Error resetting ID:', error);
        // You might want to throw the error here depending on your application's error handling strategy
        // throw error;
    }
};

module.exports = resetId;
