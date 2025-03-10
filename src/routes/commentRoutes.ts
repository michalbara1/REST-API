import express, { Router } from 'express';
import commentsControllers from '../controllers/commentController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Post a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Problem with new comment
 *       500:
 *         description: Internal server error
 */
router.post('/comment', authMiddleware, commentsControllers.postComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   get:
 *     summary: Read a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment fetched successfully
 *       400:
 *         description: Problem with fetching comment
 *       500:
 *         description: Internal server error
 */
router.get('/comment/:commentId', commentsControllers.readComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Problem with updating comment
 *       500:
 *         description: Internal server error
 */
router.put('/comment/:commentId', authMiddleware, commentsControllers.updateComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: You are not the owner of this comment
 *       500:
 *         description: Internal server error
 */
router.delete('/comment/:commentId', authMiddleware, commentsControllers.deleteComment);

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       400:
 *         description: Problem with fetching comments
 *       500:
 *         description: Internal server error
 */
router.get('/comment/get-all-comments/:postId', commentsControllers.getComments);

export default router;