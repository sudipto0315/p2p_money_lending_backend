const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { addBorrower } = require('./models/Borrower'); // Import the addBorrower function from Borrower.js

dotenv.config();

const app = express();

// Security enhancements
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors()); // Enable CORS with default settings
app.use(bodyParser.json());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// MySQL connection using promise wrapper for async/await
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}).promise();

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Logging to check the header
  
  if (!authHeader) {
    return res.status(401).header('WWW-Authenticate', 'Basic realm="Access to the addBorrow endpoint", charset="UTF-8"').json({ error: 'Authentication required' });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  console.log('Decoded Username:', username); // Logging to check the username
  console.log('Decoded Password:', password); // Logging to check the password

  if (username === 'admin' && password === 'password') {
    next(); // Proceed to the next middleware/route handler
  } else {
    return res.status(401).header('WWW-Authenticate', 'Basic realm="Access to the addBorrower endpoint", charset="UTF-8"').json({ error: 'Invalid credentials' });
  }
};

// Example route to fetch data from Library table (for testing)
app.get('/testdata', async (req, res) => {
  const sql = 'SELECT * FROM Library';
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add the /addBorrower route with authentication
app.post('/addBorrower', authenticate, async (req, res) => {
  try {
    const newBorrower = await addBorrower(req, res);
    res.status(201).json(newBorrower);
  } catch (err) {
    console.error("Error adding borrower:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
