const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const errorUtils = require("../utils/error");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorUtils.throwError("Validation failed", 422, errors);
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
    errorUtils.forwardError(err, next);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      errorUtils.throwError("User not found", 401);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      errorUtils.throwError("Wrong password", 401);
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
    errorUtils.forwardError(err, next);
  }
};
