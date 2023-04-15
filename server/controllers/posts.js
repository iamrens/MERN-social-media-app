import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);

    // validation
    if(!user) throw new Error('User not found');
    if (req.file && !['image/jpg', 'image/png', 'image/jpeg'].includes(req.file.mimetype)) {
      throw new Error('Invalid image format.');
    }
    if (req.file && req.file.size > 2097152) {
      throw new Error("Image must be less than 2mb");
    }

    let picturePath = "";
    if (req.file && req.file.path) {
      picturePath = req.file.path;
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.picturePath,
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
    const { postId } = req.params;
    const { userId, description } = req.body; 

    const post = await Post.findById(postId);

    // validation
    if (!post) throw new Error('Post not found');
    if (post.userId !== userId) throw new Error('User is not authorized to update this post');
    if (req.file && !['image/jpg', 'image/png', 'image/jpeg'].includes(req.file.mimetype)) {
      throw new Error('Invalid image format.');
    }
    if (req.file && req.file.size > 2097152) {
      throw new Error("Image must be less than 2mb");
    }

    let picturePath = post.picturePath;
    if (req.file && req.file.path) {
      picturePath = req.file.path;
    }

    // update post contents
    post.description = description;
    post.picturePath = picturePath;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE a POST
export const deletePost = async (req, res) => {
  try {
      const { postId } = req.params;
      const { userId } = req.body; 

      const post = await Post.findById(postId);

      if (!post) throw new Error('Post not found');
      if (post.userId !== userId) throw new Error('User is not authorized to delete this post');

      await Post.findByIdAndDelete(postId);
      const posts = await Post.find().sort({ createdAt: -1 });

      res.status(200).json(posts);
  } catch (err) {
      res.status(404).json({ message: err.message });
  }
};

export const postComment = async (req, res) => {
  try {
      const { postId } = req.params;
      const { userId, comment } = req.body;

      const newComment = {
        commentId: new mongoose.Types.ObjectId().toString(),
        userId,
        comment,
        createdAt: Date.now(),
      };
      const post = await Post.findById(postId);

      if (!post) throw new Error('Post not found');

      post.comments.push(newComment);

      const updatedPost = await Post.findByIdAndUpdate(
        postId, 
        {comments: post.comments},
        {new: true}
      );

      res.status(200).json(updatedPost);
  } catch (err) {
      res.status(404).json({ message: err.message });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    const comment = post.comments.find(c => c.commentId === commentId);

    // console.log(post);

    // validation
    if (!post) throw new Error('Post not found');
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new Error('User is not authorized to delete this comment');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {$pull: {comments: { commentId: commentId}}},
      {new: true}
    );

    // console.log(updatedPost);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, updatedComment, updatedAt } = req.body;
    const post = await Post.findById(postId);
    const comment = post.comments.find(c => c.commentId === commentId);

    console.log(post);

    // validation
    if (!post) throw new Error('Post not found');
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new Error('User is not authorized to delete this comment');
    }

    // update a comment
    comment.comment = updatedComment;
    comment.updatedAt = updatedAt;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: post.comments },
      { new: true }
    );

    console.log(updatedPost);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}