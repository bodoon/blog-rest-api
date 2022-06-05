const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

router.get("/post/:postId", isAuth, feedController.getPost);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title", "Title is invalid!").trim().isLength({ min: 5 }),
    body("content", "Content is invalid!").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title", "Title is invalid!").trim().isLength({ min: 5 }),
    body("content", "Content is invalid!").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
