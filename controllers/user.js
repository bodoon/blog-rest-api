import User from "../models/user.js";
import { throwError, forwardError } from "../utils/error.js";
import { validationResult } from "express-validator";

export const getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throwError("User not found", 404);
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    forwardError(err, next);
  }
};

export const updateUserStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError("Ivalid user status", 422, errors);
  }

  const { status } = req.body;
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      throwError("User not found", 404);
    }

    user.status = status;
    await user.save();

    res.status(201).json({
      message: "User status updated successfully!",
    });
  } catch (err) {
    forwardError(err, next);
  }
};
