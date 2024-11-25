const Comment = require('../models/commentModel'); 

const createComment = (req, res) => {
  const { content, postId, owner } = req.body;

  const newComment = new Comment({
    content,
    postId,
    owner
  });

  newComment.save()
    .then((comment) => res.status(201).json(comment))
    .catch((err) => res.status(400).json({ message: 'Error creating comment', error: err.message }));
};

const getAllComments = (req, res) => {
    Comment.find()
      .then((comments) => res.status(200).json(comments))
      .catch((err) => res.status(400).json({ message: 'Error fetching comments', error: err.message }));
  };

  const getCommentsByPost = (req, res) => {
    const { postId } = req.params;
  
    Comment.find({ postId })
      .then((comments) => res.status(200).json(comments))
      .catch((err) => res.status(400).json({ message: 'Error fetching comments for post', error: err.message }));
  };

  const getCommentById = (req, res) => {
    const { commentId } = req.params;
  
    Comment.findById(commentId)
      .then((comment) => {
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
      })
      .catch((err) => res.status(500).json({ message: 'Error fetching comment', error: err.message }));
  };
  

  const updateComment = (req, res) => {
    const { commentId } = req.params;
    const { content, owner } = req.body;
  
    Comment.findByIdAndUpdate(commentId, { content, owner }, { new: true })
      .then((updatedComment) => {
        if (!updatedComment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
      })
      .catch((err) => res.status(500).json({ message: 'Error updating comment', error: err.message }));
  };

  const deleteComment = (req, res) => {
    const { commentId } = req.params;
  
    Comment.findByIdAndDelete(commentId)
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
      })
      .catch((err) => res.status(500).json({ message: 'Error deleting comment', error: err.message }));
  };

  module.exports = { createComment, getAllComments,getCommentsByPost,getCommentById,updateComment,deleteComment };