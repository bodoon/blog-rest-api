const User = require("../models/user");
const errorUtils = require("../utils/error");
const { validationResult } = require("express-validator");

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      errorUtils.throwError("User not found", 404);
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    errorUtils.forwardError(err, next);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorUtils.throwError("Ivalid user status", 422, errors);
  }

  const { status } = req.body;
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      errorUtils.throwError("User not found", 404);
    }

    user.status = status;
    await user.save();

    res.status(201).json({
      message: "User status updated successfully!",
    });
  } catch (err) {
    errorUtils.forwardError(err, next);
  }
};
