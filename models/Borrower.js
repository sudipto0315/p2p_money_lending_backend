const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

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
    const { FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role } = req.body;
  
    const query = `
        INSERT INTO Borrower (BorrowerID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        await db.query(query, [BorrowerID, FirstName, LastName, Gender, MaritalStatus, DateOfBirth, PhoneNumber, Email, Occupation, Address, Role]);
        return getBorrowerByID(BorrowerID); // Return the newly added borrower
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

module.exports = {
    getBorrowerByID,
    addBorrower
};
