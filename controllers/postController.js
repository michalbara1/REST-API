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
