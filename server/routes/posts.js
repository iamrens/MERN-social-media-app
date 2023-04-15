import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost, postComment, deleteComment, updateComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST
router.route("/:postId/comments").post(verifyToken, postComment)

// READ
router.route("/").get(verifyToken, getFeedPosts);
router.route("/:userId/posts").get(verifyToken, getUserPosts)

// UPDATE
router.route("/:id/like").patch(verifyToken, likePost)
router.route("/:postId/comments/:commentId").patch(verifyToken, updateComment)

// DELETE
router.route("/:postId").delete(verifyToken, deletePost);
router.route("/:postId/comments/:commentId").delete(verifyToken, deleteComment)

export default router;