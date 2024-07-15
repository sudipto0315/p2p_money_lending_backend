const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const borrowerRoutes = require('./routes/BorrowerRoutes');
const kycRoutes = require('./routes/KYCRoutes');
const testdataRoutes = require('./routes/testdataRoutes');
const LenderRoutes = require('./routes/LenderRoutes');
const userRoutes = require('./routes/UserRoutes')
const loanRoutes = require('./routes/LoanRoutes.js')

dotenv.config();

const app = express();

// Trust the proxy to correctly handle X-Forwarded-For header
app.set('trust proxy', 1);

// Security enhancements
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/testdata',testdataRoutes);
app.use('/borrower', borrowerRoutes);
app.use('/kyc', kycRoutes);
app.use('/lender', LenderRoutes);
app.use('/user', userRoutes);
app.use('/loan', loanRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));