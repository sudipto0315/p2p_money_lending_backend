const db = require("../config/db");

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

const createLenderTable= `
    CREATE TABLE IF NOT EXISTS Lender (
        LenderID CHAR(36) PRIMARY KEY,
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

const createLoan_RequestTable= `
    CREATE TABLE Loan_Request (
        LoanRequestID INT AUTO_INCREMENT PRIMARY KEY,
        BorrowerID CHAR(36),
        Tenure INT NOT NULL, -- in months
        Amount DECIMAL(10, 2) NOT NULL,
        Description TEXT,
        CreditScore INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        FOREIGN KEY (BorrowerID) REFERENCES Borrower(BorrowerID)
    )
`;


const createLoanTable= `
    CREATE TABLE Loan (
        LoanID INT AUTO_INCREMENT PRIMARY KEY,
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
    CREATE TABLE Payment (
        BlockchainTransactionID VARCHAR(255) PRIMARY KEY,
        LoanID INT,
        PaymentAmount DECIMAL(10, 2) NOT NULL,
        PaymentDate DATE NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (LoanID) REFERENCES Loan(LoanID)
    )
`;

const createLoanScheduleTable= `
    CREATE TABLE LoanSchedule (
        ScheduleID INT AUTO_INCREMENT PRIMARY KEY,
        LoanID INT,
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
        await db.query(createBorrowerTable);
        console.log("Created Borrower table");

        await db.query(createKYCTable);
        console.log("Created KYC table");
        
        await db.query(createLenderTable);
        console.log("Created Lender table");
        
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