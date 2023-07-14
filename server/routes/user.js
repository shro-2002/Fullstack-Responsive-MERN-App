import express from 'express';
import {getUser,getUserfollowings,getUserfollowers,addremovefollowers} from "../controllers/user.js";
import {verify} from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Read

router.get("/:id", verify, getUser);
router.get("/followings/:id", verify, getUserfollowings);
router.get("/followers/:id", verify, getUserfollowers);

// Update
router.patch("/:id/followerId", verify, addremovefollowers);

export default router;