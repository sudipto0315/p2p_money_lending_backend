const db = require("../config/db");

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        UserID CHAR(36) PRIMARY KEY,
        Email VARCHAR(100) NOT NULL,
        Role ENUM('Borrower', 'Lender') NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(Email, Role)
    )
`;

const createBorrowerTable = `
    CREATE TABLE IF NOT EXISTS Borrower (
        BorrowerID CHAR(36) PRIMARY KEY NOT NULL,
        UserID CHAR(36) NOT NULL,
        FirstName VARCHAR(50) NOT NULL,
        LastName VARCHAR(50) NOT NULL,
        Gender VARCHAR(10) NOT NULL,
        MaritalStatus VARCHAR(15) NOT NULL,
        DateOfBirth DATE NOT NULL,
        PhoneNumber VARCHAR(15) NOT NULL,
        Email VARCHAR(100) NOT NULL,
        Occupation VARCHAR(15) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        Role ENUM('Borrower', 'Lender') NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
    )
`;

const createLenderTable= `
    CREATE TABLE IF NOT EXISTS Lender (
        LenderID CHAR(36) PRIMARY KEY NOT NULL,
        UserID CHAR(36) NOT NULL,
        FirstName VARCHAR(50) NOT NULL,
        LastName VARCHAR(50) NOT NULL,
        Gender VARCHAR(10) NOT NULL,
        MaritalStatus VARCHAR(15) NOT NULL,
        DateOfBirth DATE NOT NULL,
        PhoneNumber VARCHAR(15) NOT NULL,
        Email VARCHAR(100) NOT NULL,
        Occupation VARCHAR(15) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        Role ENUM('Borrower', 'Lender') NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
    )
`;

const createKYCTable = `
    CREATE TABLE IF NOT EXISTS KYC (
        UserID CHAR(36) PRIMARY KEY,
        AadhaarNumber VARCHAR(50) NOT NULL,
        PANNumber VARCHAR(50) NOT NULL,
        BankAccountNumber VARCHAR(50) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
    )
`;


const createVerificationTable = `
    CREATE TABLE IF NOT EXISTS Verification (
        UserID CHAR(36) PRIMARY KEY,
        IncomeCategory VARCHAR(50) NOT NULL,
        IncomeAmount DECIMAL(10, 2) NOT NULL,
        ExistingPropertyValue DECIMAL(10, 2) NOT NULL,
        LastLoanAmount DECIMAL(10, 2) NOT NULL,
        LastLoanDate DATE NOT NULL,
        LastLoanStatus VARCHAR(50) NOT NULL,
        PreviousDefaultedLoan ENUM('Yes', 'No') NOT NULL,
        PreviousDefaultedLoanAmount DECIMAL(10, 2) NOT NULL,
        PreviousDefaultedLoanReason TEXT,
        PhysicalVerificationScore INT NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Borrower (BorrowerID)
    )
`;

const createLoan_RequestTable= `
    CREATE TABLE IF NOT EXISTS Loan_Request (
        LoanRequestID CHAR(36) PRIMARY KEY NOT NULL,
        BorrowerID CHAR(36),
        LoanType ENUM('Personal Loan', 'Medical Loan', 'Education Loan', 'Agricultue/Business Loan', 'House Loan') NOT NULL DEFAULT 'Personal Loan',
        Tenure INT NOT NULL, -- in months
        Amount DECIMAL(10, 2) NOT NULL,
        Description TEXT,
        CreditScore FLOAT NOT NULL DEFAULT 7.1,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        FOREIGN KEY (BorrowerID) REFERENCES Borrower(BorrowerID)
    )
`;


const createLoanTable= `
    CREATE TABLE IF NOT EXISTS Loan (
        LoanID CHAR(36) PRIMARY KEY NOT NULL,
        BorrowerID CHAR(36),
        LenderID CHAR(36),
        Amount DECIMAL(10, 2) NOT NULL,
        RemainingAmount DECIMAL(10, 2) NOT NULL,
        PaidAmount DECIMAL(10, 2) DEFAULT 0,
        InterestRate DECIMAL(5, 2) NOT NULL,
        LoanTerm INT NOT NULL, -- in months
        StartDate DATE NOT NULL,
        EndDate DATE NOT NULL,
        Status ENUM('Pending', 'Approved', 'Rejected', 'Closed') DEFAULT 'Pending',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (BorrowerID) REFERENCES Borrower(BorrowerID),
        FOREIGN KEY (LenderID) REFERENCES Lender(LenderID)
    )
`;

const createPaymentTable= `
    CREATE TABLE IF NOT EXISTS Payment (
        BlockchainTransactionID VARCHAR(255) PRIMARY KEY,
        LoanID CHAR(36),
        PaymentAmount DECIMAL(10, 2) NOT NULL,
        PaymentDate DATE NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (LoanID) REFERENCES Loan(LoanID)
    )
`;

const createLoanScheduleTable= `
    CREATE TABLE IF NOT EXISTS LoanSchedule (
        ScheduleID CHAR(36) PRIMARY KEY NOT NULL,
        LoanID CHAR(36),
        DueDate DATE NOT NULL,
        PaymentAmount DECIMAL(10, 2) NOT NULL,
        NextRepaymentDate DATE NOT NULL,
        NextRepaymentAmount DECIMAL(10, 2) NOT NULL,
        Status ENUM('Pending', 'Paid') DEFAULT 'Pending',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (LoanID) REFERENCES Loan(LoanID)
    )
`;

async function createTables() {
    try {
        await db.query(createUsersTable);
        console.log("Created Users table");
        
        await db.query(createBorrowerTable);
        console.log("Created Borrower table");
        
        await db.query(createLenderTable);
        console.log("Created Lender table");

        await db.query(createKYCTable);
        console.log("Created KYC table");
        
        await db.query(createLoanTable);
        console.log("Created Loan table");

        await db.query(createLoan_RequestTable);
        console.log("Created Loan_Request table");

        await db.query(createPaymentTable);
        console.log("Created Payment table");

        await db.query(createLoanScheduleTable);
        console.log("Created LoanSchedule table");

        await db.query(createVerificationTable);
        console.log("Created Verification table");

        console.log("All tables created successfully");
    } catch (err) {
        console.error("Error creating tables:", err);
    }
}

createTables().then(() => process.exit(0));