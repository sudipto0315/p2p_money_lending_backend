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

module.exports = authenticate;