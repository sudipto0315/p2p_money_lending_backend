const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

async function getBorrowerByID(BorrowerID) {
    const query = `SELECT * FROM Borrower WHERE BorrowerID = ?`;
    try {
        const [rows] = await db.query(query, [BorrowerID]);
        return rows[0]; // Assuming there is only one Borrower with the given BorrowerID
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}

const addBorrower = async (req, res) => {
    const BorrowerID = uuidv4(); // Generate a new UUID for the borrower
    const { UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role } = req.body;
  
    const query = `
        INSERT INTO Borrower (BorrowerID, UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        await db.query(query, [BorrowerID, UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role]);
        return BorrowerID; // Return the UUID of the newly added borrower if needed
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

module.exports = {
    getBorrowerByID,
    addBorrower
};
