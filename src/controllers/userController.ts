import userModel from "../models/userModel";
import { Request, Response } from "express";
import BaseController from "./baseController";

const userController = new BaseController(userModel);

export default userController;