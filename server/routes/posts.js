import express from 'express';
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import {verify} from "../middleware/auth.js";

const router = express.Router();

// Read

router.get("/feed/:id", verify, getFeedPosts);
router.get("/posts/:id", verify, getUserPosts);

// Update
router.patch("/:id/likepost", verify, likePost);

export default router;

