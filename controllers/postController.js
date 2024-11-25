const Post = require('../models/postModel');

exports.createPost = async (req, res) => {
  try {
    const { title, content, owner, senderId } = req.body;
    if (!senderId) {
      return res.status(400).json({ message: "senderId is required" });
    }
    const newPost = new Post({
      title,
      content,
      owner,
      senderId,
    });
    await newPost.save();
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create post',
      error: error.message,
    });
  }
};

exports.getPostsBySender = async (req, res) => {
  try {
    const senderId = req.query.sender;  
    let posts;
    if (senderId) {
      console.log('Sender ID:', senderId);
      posts = await Post.find({ senderId: senderId });
    } else {
      posts = await Post.find();
    }
    if (posts.length === 0) {
      return res.status(404).json({
        message: 'No posts found for the specified sender',
      });
    }
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
};
exports.getPostById = async (req, res) => {
  const postId = req.params.id; 
  try {
    const post = await Post.findById(postId); 
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({
      message: 'Post fetched successfully',
      post: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, senderId, owner } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      title,
      content,
      senderId,  
      owner,     
    }, { new: true });  
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update post',
      error: error.message,
    });
  }
};