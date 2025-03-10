import express, { Router } from 'express';
import postController from '../controllers/postController';
import authMiddleware from '../middleware/authMiddleware';
import multerMiddleware from '../middleware/multerMiddleware';

const router: Router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts', postController.getAllPosts);

/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Get posts by sender
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts/sender', authMiddleware, postController.getPostsBySender);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Problem with creating post
 *       500:
 *         description: Internal server error
 */
router.post('/posts', authMiddleware, postController.savePost);

/**
 * @swagger
 * /posts/like/{id}:
 *   put:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       400:
 *         description: Problem with liking/unliking post
 *       500:
 *         description: Internal server error
 */
router.put('/posts/like/:id', authMiddleware, postController.likePost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get('/posts/:id', postController.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post updated successfully
 *       400:
 *         description: Problem with updating post
 *       500:
 *         description: Internal server error
 */
router.put('/posts/:id', authMiddleware, postController.updateById);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Problem with deleting post
 *       500:
 *         description: Internal server error
 */
router.delete('/posts/:id', authMiddleware, postController.deletePost);

/**
 * @swagger
 * /posts/upload:
 *   post:
 *     summary: Upload a photo
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *       400:
 *         description: Problem with uploading photo
 *       500:
 *         description: Internal server error
 */
router.post('/posts/storage',multerMiddleware, postController.savePhoto);
/**
 * @swagger
 * /posts/ai:
 *   post:
 *     summary: Generate AI content
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI content generated successfully
 *       500:
 *         description: Problem with generating AI content
 */
router.post('/posts/ai', postController.getAiContent);


export default router;