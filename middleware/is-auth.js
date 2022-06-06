import jwt from "jsonwebtoken";
import { throwError } from "../utils/error.js";

export default (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretlongstring");
  } catch (error) {
    throwError("Token verifying failed");
  }
  if (!decodedToken) {
    throwError("Authentication failed", 401);
  }
  req.userId = decodedToken.userId;
  next();
};
