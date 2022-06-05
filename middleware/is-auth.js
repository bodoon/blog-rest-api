const jwt = require("jsonwebtoken");
const errorUtils = require("../utils/error");

module.exports = (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretlongstring");
  } catch (error) {
    errorUtils.throwError("Token verifying failed");
  }
  if (!decodedToken) {
    errorUtils.throwError("Authentication failed", 401);
  }
  req.userId = decodedToken.userId;
  next();
};
