import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, updatePost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
// router.route("/").post(verifyToken, createPost);

// READ
router.route("/").get(verifyToken, getFeedPosts);
router.route("/:userId/posts").get(verifyToken, getUserPosts)

// UPDATE
router.route("/:id/like").patch(verifyToken, likePost)
router.route("/:id").patch(verifyToken, updatePost);

// DELETE
router.route("/:id").delete(verifyToken, deletePost);

export default router;