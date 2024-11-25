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

module.exports = { createComment}