import express, { Router } from 'express';
import authControllers from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/auth/login', authControllers.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Email or password not valid
 *       500:
 *         description: Internal server error
 */
router.post('/auth/register', authControllers.register);

/**
 * @swagger
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh token
 *     responses:
 *       200:
 *         description: New access token
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Internal server error
 */
router.get('/auth/refreshToken', authControllers.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful logout
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Internal server error
 */
router.post('/auth/logout', authControllers.logout);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/auth/user', authMiddleware, authControllers.getUserInfo);

/**
 * @swagger
 * /auth/user/update:
 *   post:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               image:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/auth/user/update', authMiddleware, authControllers.profileUpdate);
/**
 * @swagger
 * /auth/googlelogin:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 */
router.post('/auth/googlelogin', authControllers.googlelogin);

export default router;