const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

async function getKYCByUserID(BorrowerID) {
    const query = `SELECT * FROM KYC WHERE UserID = ?`;
    try {
        const [rows] = await db.query(query, [BorrowerID]);
        return rows[0]; // Assuming there is only one KYC with the given BorrowerID
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}

const addKYC = async (req, UserID) => {
    const { AadhaarNumber, PANNumber, BankAccountNumber } = req.body;

    const query = `
        INSERT INTO KYC (UserID, AadhaarNumber, PANNumber, BankAccountNumber)
        VALUES (?, ?, ?, ?)
    `;
    try {
        await db.query(query, [UserID, AadhaarNumber, PANNumber, BankAccountNumber]);
        return getKYCByUserID(UserID); // Return the newly added KYC
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

module.exports = {
    getKYCByUserID,
    addKYC
};
