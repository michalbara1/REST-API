import commentsModel, { IComments } from "../models/commentModel";
import { Request, Response } from "express";
import BaseController from "./baseController";

const commentsController = new BaseController<IComments>(commentsModel);


export default commentsController