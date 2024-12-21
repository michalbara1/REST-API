import express from "express";
const router = express.Router();
import postController from "../controllers/postController";

router.post('/', postController.create.bind(postController));

router.get('/getposts', postController.getAll.bind(postController));

router.get('/:id',postController.getById.bind(postController));

router.get('/', postController.getAll.bind(postController)); //get by sender

router.put('/:id', postController.update.bind(postController));

export default router;
