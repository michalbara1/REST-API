import postModel from "../models/postModel";
import { Request, Response } from "express";
import BaseController from "./baseController";

const postsController = new BaseController(postModel);

export default postsController;