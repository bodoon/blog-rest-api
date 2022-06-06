import express from "express";
import { body } from "express-validator";

import { getUserStatus, updateUserStatus } from "../controllers/user.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/status", isAuth, getUserStatus);

router.post(
  "/status",
  isAuth,
  [body("status", "Invalid status").trim().notEmpty()],
  updateUserStatus
);

export default router;
