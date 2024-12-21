import express from "express";
const router = express.Router();
import commentController from "../controllers/commentController";

router.post('/', commentController.create.bind(commentController));

router.get('/', commentController.getAll.bind(commentController)); // to get comments by owner

router.get('/getcomments', commentController.getAll.bind(commentController));

router.get('/:id', commentController.getById.bind(commentController));

router.put('/:id', commentController.update.bind(commentController));

router.delete('/:id', commentController.deleteItem.bind(commentController));

export default router;
