const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

async function getLoanByID(LoanRequestID) {
    const query = `SELECT * FROM Loan WHERE LoanRequestID = ?`;
    try {
        const [rows] = await db.query(query, [LoanRequestID]);
        return rows[0]; // Assuming there is only one Loan with the given LoanID
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

async function addLoanRequest(req, res) {
    const LoanRequestID = uuidv4(); // Generate a new UUID for the loan
    const { BorrowerID, Tenure, Amount, Description} = req.body;

    const query = `
        INSERT INTO Loan_Request (LoanRequestID, BorrowerID, Tenure, Amount, Description) 
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        await db.query(query, [LoanRequestID, BorrowerID, Tenure, Amount, Description]);
        return LoanRequestID; // Return the UUID of the newly added loan
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

module.exports = {
    addLoanRequest,
    getLoanByID
};