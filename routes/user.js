const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/status", isAuth, userController.getUserStatus);

router.post(
  "/status",
  isAuth,
  [body("status", "Invalid status").trim().notEmpty()],
  userController.updateUserStatus
);

module.exports = router;
