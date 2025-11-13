const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); 
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).send({ message: 'Forbidden: Invalid token.' });
  }
};

module.exports = verifyToken;