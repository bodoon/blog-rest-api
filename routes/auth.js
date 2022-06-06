import express from "express";
import { body } from "express-validator";

import { signup, login } from "../controllers/auth.js";
import User from "../models/user.js";

const router = express.Router();

// /auth/...
router.put(
  "/signup",
  [
    body("email", "Invalid email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("User already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password should be 5 characters long")
      .trim()
      .isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

export default router;
