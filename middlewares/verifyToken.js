const jwt = require('jsonwebtoken');

const verifyToken = function (req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'false', message: '請先登入' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'false', message: 'Token 無效或已過期' });
  }
};

module.exports = verifyToken;