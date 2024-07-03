const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID v4 generator

async function getUserByID(UserID) {
  const query = `SELECT * FROM Users WHERE UserID = ?`;
  try {
    const [rows] = await db.query(query, [UserID]);
    return rows[0]; // Assuming there is only one User with the given UserID
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

async function getUserByEmailandRole(Email, Role) {
  const query = `SELECT UserID FROM Users WHERE Email = ? AND Role = ?`;
  try {
    const [rows] = await db.query(query, [Email, Role]);
    if (rows.length === 0) {
      return null; // No user found
    }
    return rows[0]; // Assuming there is only one User with the given Email and Role
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

const getUserRole = async (Email) => {
  const query = `SELECT Role FROM Users WHERE Email = ?`;
  try {
    const [rows] = await db.query(query, [Email]);
    if (rows.length === 0) {
      return null; // No user found
    }
    // Map the rows to extract just the Role values into an array
    const roles = rows.map(row => row.Role);
    return roles; // Return the array of roles
  }
  catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

const addUser = async (req, res) => {
  const UserID= uuidv4(); // Generate a new UUID for the user
  const {Email, Role} = req.body;

  const query = `
      INSERT INTO Users (UserID, Email, Role) 
      VALUES (?, ?, ?)
  `;
  try{
    await db.query(query, [UserID, Email, Role]);
    return UserID; // Return the UUID of the newly added user
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

module.exports = {
  getUserByID,
  getUserByEmailandRole,
  addUser,
  getUserRole
};
