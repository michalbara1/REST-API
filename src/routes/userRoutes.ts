import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

router.post('/', userController.create.bind(userController));

router.get('/getusers', userController.getAll.bind(userController));

router.get('/:id',userController.getById.bind(userController));

router.put('/:id', userController.update.bind(userController));

router.delete('/:id', userController.deleteItem.bind(userController));

export default router;
