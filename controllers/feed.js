import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { validationResult } from "express-validator";

import io from "../socket.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import { throwError, forwardError } from "../utils/error.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!posts) {
      throwError("Posts not found", 404);
    }

    res.status(200).json({
      message: "Posts fetched",
      posts,
      totalItems,
    });
  } catch (err) {
    forwardError(err, next);
  }
};

export const getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      throwError("Post not found", 404);
    }

    res.status(200).json({
      message: "Post fetched",
      post,
    });
  } catch (err) {
    forwardError(err, next);
  }
};

export const createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throwError("Validation failed", 422);
  }

  if (!req.file) {
    throwError("Invalid image", 422);
  }

  try {
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });
    await post.save();

    const user = await User.findById(req.userId);
    if (!user) {
      throwError("User not found", 404);
    }
    user.posts.push(post);
    await user.save();

    io.getIO().emit("posts", { action: "create", post });

    res.status(201).json({
      message: "Post created successfully!",
      post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    forwardError(err, next);
  }
};

export const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError("Validation failed", 422);
  }

  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    throwError("Invalid image", 422);
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      throwError("Post not found", 404);
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      throwError("Not authorized", 403);
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();

    io.getIO().emit("posts", { action: "update", post: result });

    res.status(201).json({
      message: "Post updated successfully!",
      post: result,
    });
  } catch (err) {
    forwardError(err, next);
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throwError("Post not found", 404);
    }

    if (post.creator.toString() !== req.userId.toString()) {
      throwError("Not authorized", 403);
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    io.getIO().emit("posts", { action: "delete", post: postId });

    res.status(201).json({
      message: "Post deleted successfully!",
    });
  } catch (err) {
    forwardError(err, next);
  }
};

function clearImage(imagePath) {
  const filePath = path.join(__dirname, "..", imagePath);
  fs.unlink(filePath, (err) => console.log(err));
}
