const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const validateToken = (req, res, next) => {
  if (!req.cookies || !req.cookies.BEReload_Token) {
    return res
      .status(401)
      .json({ message: "User is not authorized or token is missing" });
  }

  const token = req.cookies.BEReload_Token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "User is not authorized, invalid token" });
  }
};

module.exports = validateToken;
