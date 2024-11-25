const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/posts', postController.createPost);

router.get('/getposts', postController.getAllPosts);

router.get('/posts/:id', postController.getPostById);

router.get('/posts', postController.getPostsBySender);

router.put('/posts/:id', postController.updatePost);


module.exports = router;