import { Request, Response } from "express";
import postModel from "../models/postModel";
import { responseReturn } from "../utils/response";
import { Types } from 'mongoose';
import commentsModel from "../models/commentModel";
import userModel from "../models/userModel";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class PostController {
    getAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const skip = (page - 1) * limit;
            const sort = req.query.sort as string || "createdAt";
            const [getPosts, total] = await Promise.all([
                postModel.find().sort('-'+sort).skip(skip).limit(limit),
                postModel.countDocuments()
            ]);
    
            if (getPosts) {
                responseReturn(res, 200, { 
                    getPosts, 
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalPosts: total,
                    message: "posts fetched" 
                });
            } else {
                responseReturn(res, 400, { message: "Problem in fetching posts" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    savePost = async (req: Request, res: Response): Promise<void> => {
        const {userId}=req.body
        try {
            const user = await userModel.findById(new Types.ObjectId(userId));
            if (!user) {
                responseReturn(res, 400, { message: "User not found" });
                return;
            }
            const userName = user.userName;
            const userImg = user.image;
            const postImg = req.body.img;
 
            const newPost = await postModel.create({
                content: req.body.content,
                title: req.body.title ,
                ownerId : userId , 
                userName ,
                userImg,
                postImg

            });
            if (newPost) {   
                responseReturn(res, 201, { newPost,message: "new post created" });
            } else {
                responseReturn(res, 400, { message: "new post not working" });
                
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    getPostsBySender = async (req: Request, res: Response): Promise<void> => {
        try {
            const senderPosts = await postModel.find({ 'ownerId': req.body.userId });
            if (senderPosts) {
                responseReturn(res, 200, { senderPosts });
            } else {
                responseReturn(res, 400, { message: "couldn't fetch the specific user posts" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    getPostById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if (post) {
                responseReturn(res, 200, { post, message: "post found by id" });
            } else {
                responseReturn(res, 400, { message: "post not found by id" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with find by id" });
        }
    }

    updateById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { content, title, userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if (!post) {
                responseReturn(res, 400, { message: "post not found" });
                return;
            }
            if(userId !== post.ownerId.toString()){
                responseReturn(res, 400, { message: "you are not the owner of this post" });
                return;
            }
            const postImg = req.body.img;
            const updatePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { content, title , postImg } , { new: true });
            if (updatePost) {
                responseReturn(res, 201, { updatePost, message: "post updated by id" });
                return;
            } else {
                responseReturn(res, 400, { message: "post not updated by id" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with updated by id" });
        }
    }

    likePost = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { userId } = req.body;
       
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
        
            if (post && post.likes.includes(userId)) {
                post.likes = post.likes.filter((like) => like.toString() !== userId);
                post.numLikes = post.likes.length;
                await post.save();
                responseReturn(res, 200, {post, message: "post unliked" });
               return;
            }
            if (post) {
                post.likes.push(userId);
                post.numLikes = post.likes.length;
                await post.save();
                responseReturn(res, 200, { post, message: "post liked" });
            } else {
                responseReturn(res, 400, { message: "post not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with like post" });
        }
    }
    deletePost = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if (!post) {
                responseReturn(res, 400, { message: "post not found" });
                return;
            }
            if (post.ownerId.toString() !== userId) {
                responseReturn(res, 400, { message: "you are not the owner of this post" });
                return;
            }
            const deletePost = await postModel.findByIdAndDelete(new Types.ObjectId(id));
            if (deletePost) {
                await commentsModel.deleteMany({ postId: new Types.ObjectId(id) });
                responseReturn(res, 200, { post : deletePost,message: "post deleted" });
                return;
            } else {
                responseReturn(res, 400, { message: "post not deleted" });
            }
        } catch (error) {

            responseReturn(res, 500, { message: "problem with delete post" });
        }
    }
 

savePhoto = async (req: Request, res: Response): Promise<void> => {
  
    try {
        if (!req.file) {
            responseReturn(res, 400, { message: "file not found" });
            return;
        }
        const fileUrl = `/storage/${req.file.filename}`;  // Fixed template string syntax
        responseReturn(res, 200, { url: fileUrl });
    } catch (error) {
        responseReturn(res, 500, { message: "Error uploading file" });
    }
}
getAiContent = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;

  try {
      if(!title){
          throw new Error("Title is required");    
      }
      const prompt = `generate stroy for "${title}" used only 70 words`;
      const result = await model.generateContent(prompt);
      const aiContent = result.response.text();
      responseReturn(res, 200, { content: aiContent });
  } catch (error) {
      responseReturn(res, 500, { message: "Error generating AI content" });
  }
}
}

export default new PostController();
