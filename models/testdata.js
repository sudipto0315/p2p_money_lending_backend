const db = require('../config/db');

async function getTestData() {
    const query = 'SELECT * FROM Library';
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}

module.exports = {
    getTestData
};
