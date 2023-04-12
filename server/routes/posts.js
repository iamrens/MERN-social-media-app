import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, updatePost, deletePost, postComment, deleteComment, updateComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST
router.route("/:postId/comments").post(verifyToken, postComment)

// READ
router.route("/").get(verifyToken, getFeedPosts);
router.route("/:userId/posts").get(verifyToken, getUserPosts)

// UPDATE
router.route("/:id/like").patch(verifyToken, likePost)
router.route("/:id").patch(verifyToken, updatePost);
router.route("/:postId/comments/:commentId").patch(verifyToken, updateComment)

// DELETE
router.route("/:id").delete(verifyToken, deletePost);
router.route("/:postId/comments/:commentId").delete(verifyToken, deleteComment)

export default router;