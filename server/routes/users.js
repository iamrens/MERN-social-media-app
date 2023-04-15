import express from "express";
import { getUser, getUserFriends, addRemoveFriend, searchUser } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.route("/search").get(verifyToken, searchUser)
router.route("/:id").get(verifyToken, getUser)
router.route("/:id/friends").get(verifyToken, getUserFriends)


// UPDATE
router.route("/:id/:friendId").patch(verifyToken, addRemoveFriend)


export default router;