"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const postController_1 = __importDefault(require("../controllers/postController"));
const authController_1 = require("../controllers/authController");
/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         owner:
 *           type: string
 *           description: The owner id of the post
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Post
 *         content: This is the content of my first post.
 *         author: 324vt23r4tr234t245tbv45by
 */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", authController_1.authMiddleware, postController_1.default.create.bind(postController_1.default));
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get('/getposts', postController_1.default.getAll.bind(postController_1.default));
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/:id', postController_1.default.getById.bind(postController_1.default));
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get posts by sender Id
 *     description: Retrieve a list of posts by sender Id
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the sender
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get('/', postController_1.default.getAll.bind(postController_1.default));
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     description: Update a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/:id', postController_1.default.update.bind(postController_1.default));
/**
 * @swagger
 * posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a single post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authController_1.authMiddleware, postController_1.default.deleteItem.bind(postController_1.default));
exports.default = router;
//# sourceMappingURL=postRoutes.js.map