const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');  // Adjust path to your controller

router.post('/comments', commentController.createComment);

router.get('/comments', commentController.getAllComments);

router.get('/comments/posts/:postId', commentController.getCommentsByPost);

router.get('/comments/:commentId', commentController.getCommentById);

router.put('/comments/:commentId', commentController.updateComment);



module.exports = router;