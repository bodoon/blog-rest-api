import express from "express";
import { body } from "express-validator";

import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

router.get("/post/:postId", getPost);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title", "Title is invalid!").trim().isLength({ min: 5 }),
    body("content", "Content is invalid!").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title", "Title is invalid!").trim().isLength({ min: 5 }),
    body("content", "Content is invalid!").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

export default router;
