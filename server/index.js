import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Posts.js";
import{users,posts} from "./data/index.js";
import {verify} from './middleware/auth.js';

// Configuration

const __filename= fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app= new express();
app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

// routes with file upload
app.post("/auth/register", upload.single("picture"), verify, register);
app.post("/posts", verify,upload.single("picture"), createPost);

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

// Set up mongoose
const PORT= process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    
        /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
})

.catch(err => console.log('Error: ', err.message));

// Login
export const login = async (req, res) => {
    try{
        const{email, password} = req.body;
        const user = await User.findOne({email: email});
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(password, user.password);
        !validPassword && res.status(400).json("wrong password");

        const accessToken = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );

        delete user.password;
        res.status(200).json(user);
    } 
    catch(err) {
        res.status(500).json(err);

    }
}

