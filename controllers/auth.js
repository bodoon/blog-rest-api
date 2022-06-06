import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user.js";
import { throwError, forwardError } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    const { email, name, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPw,
    });
    const result = await user.save();

    res.status(201).json({ message: "User created", userId: result._id });
  } catch (err) {
    forwardError(err, next);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throwError("User not found", 401);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throwError("Wrong password", 401);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretlongstring",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    forwardError(err, next);
  }
};
