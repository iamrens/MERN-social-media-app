import Post from "../models/Post.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    if(!user) throw new Error('User not found');

    // let photoUrl;
    // if (picturePath) {
    //     photoUrl = await cloudinary.uploader.upload(picturePath);
    // }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      // picturePath: photoUrl ? photoUrl.url : null,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE a POST
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, picturePath, userId } = req.body;
    const post = await Post.findById(id);

    if (!post) throw new Error('Post not found');
    // if (post.userId !== userId) throw new Error('User is not authorized to edit this post');

    let photoUrl = post.picturePath;
    if (picturePath) {
      photoUrl = await cloudinary.uploader.upload(picturePath);
    }

    const updatedFields = {
      description: description ? description : post.description,
      picturePath: photoUrl ? photoUrl.url : post.picturePath,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
      const { id } = req.params;
      const { userId } = req.body; 

      const post = await Post.findById(id);

      if (!post) throw new Error('Post not found');
      // if (post.userId !== userId) throw new Error('User is not authorized to delete this post');

      await Post.findByIdAndDelete(id);

      res.status(200).json({ message: 'Post deleted successfully.' });

  } catch (err) {
      res.status(404).json({ message: err.message });
  }
};