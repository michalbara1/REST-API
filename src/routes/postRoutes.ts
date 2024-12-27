import express from "express";
const router = express.Router();
import postController from "../controllers/postController";
import { authMiddleware } from "../controllers/authController";

router.post("/", authMiddleware, postController.create.bind(postController));

router.get('/getposts', postController.getAll.bind(postController));

router.get('/:id',postController.getById.bind(postController));

router.get('/', postController.getAll.bind(postController)); //get by sender

router.put('/:id', postController.update.bind(postController));

router.delete("/:id", authMiddleware, postController.deleteItem.bind(postController));

export default router;
