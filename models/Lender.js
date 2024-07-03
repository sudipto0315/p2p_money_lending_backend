const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

async function getLenderByID(LenderID) {
    const query = `SELECT * FROM Lender WHERE LenderID = ?`;
    try {
        const [rows] = await db.query(query, [LenderID]);
        return rows[0]; // Assuming there is only one Lender with the given LenderID
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}

const addLender = async (req, res) => {
    const LenderID = uuidv4(); // Generate a new UUID for the lender
    const { UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role } = req.body;

    const query = `
        INSERT INTO Lender (LenderID, UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        await db.query(query, [LenderID, UserID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role]);
        return LenderID; // Return the UUID of the newly added lender
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

module.exports = {
    getLenderByID,
    addLender
};