import jwt from "jsonwebtoken";

export const verify = (req, res, next) => {
    let token = req.headers["Authorization"];

    if (!token) {
        return res.status(403).json("You are not authenticated!");

    } 

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
        return res.status(401).json("Token verification failed, authorization denied.");
    }

    req.user = verified.id;
    next();

}

// Compare this snippet from routes\user.js:
// import express from "express";
// import {verify} from "../middleware/auth.js";
// import {updateUser} from "../controllers/user.js";
//

// const router = express.Router();

// // Update
// router.put("/:id", verify, updateUser);

// export default router;

