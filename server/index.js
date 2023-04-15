import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost, updatePost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// CONFIGS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'friendzone-mern/profile-pictures',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
  filename: (req, file, cb) => {
    cb(undefined, file.originalname);
}
});

// Set up Cloudinary storage for post pictures
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'friendzone-mern/post-pictures',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
  filename: (req, file, cb) => {
    cb(undefined, file.originalname);
}
});

// Set up Multer for handling file uploads
const uploadProfile = multer({ storage: profileStorage, limits: { fileSize: 2097152 } });
const uploadPost = multer({ storage: postStorage, limits: { fileSize: 2097152 } });

// ROUTES WITH FILES
app.post("/auth/register", uploadProfile.single("picture"), register);
app.post("/posts", verifyToken, uploadPost.single("image"), createPost);
app.patch("/posts/:postId", verifyToken, uploadPost.single("image"), updatePost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get('/', (req, res) => {
    res.send({ message: 'Hello World!' });
})

// MONGOOSE SETUP
const PORT = process.env.PORT || 6000;
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));