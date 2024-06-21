const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    // SSL configuration can be added here if your MySQL server requires it
});

const createBorrowerTable = `
    CREATE TABLE IF NOT EXISTS Borrower (
        BorrowerID CHAR(36) PRIMARY KEY,
        FirstName VARCHAR(50) NOT NULL,
        LastName VARCHAR(50) NOT NULL,
        Gender VARCHAR(10) NOT NULL,
        MaritalStatus VARCHAR(15) NOT NULL,
        DateOfBirth DATE NOT NULL,
        PhoneNumber VARCHAR(15) NOT NULL,
        Email VARCHAR(100) NOT NULL,
        Occupation VARCHAR(15) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        Role VARCHAR(15) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const createKYCTable = `
    CREATE TABLE IF NOT EXISTS KYC (
        UserID CHAR(36) PRIMARY KEY,
        AadhaarNumber VARCHAR(50) NOT NULL,
        PANNumber VARCHAR(50) NOT NULL,
        BankAccountNumber VARCHAR(50) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Borrower (BorrowerID)
    )
`;

async function createTables() {
    try {
        await db.query(createBorrowerTable);
        console.log("Created Borrower table");

        await db.query(createKYCTable);
        console.log("Created KYC table");
    } catch (err) {
        console.error("Error creating tables:", err);
    }
}

createTables();