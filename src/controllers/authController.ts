import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {responseReturn}  from '../utils/response';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/token';
import postModel from '../models/postModel';
import commentsModel from '../models/commentModel';


class authControllers {

login = async (req: Request, res: Response): Promise<void> => {
    const {email,password} =req.body
    
    if(!email || !password){
      responseReturn(res,400,{error : "password and email are required"})
    }
  try {
      const user = await User.findOne({email})
      if(!user){
            responseReturn(res,400,{error : "password or email are not found"})
            return;
      }
      const isValid = user.password ? await bcrypt.compare(password, user.password) : false;
      if(!isValid){
            responseReturn(res,400,{error : "password or email are not found"})
            return;
      }
      const accessToken  = await createToken({ id: user._id },"1h")
      const refreshToken = await createToken({ id: user._id }, "7d");
      user.refreshTokens = user.refreshTokens ? [...(user.refreshTokens as string[]), refreshToken] : [refreshToken];
      await user.save();
      responseReturn(res,200,{refreshToken, accessToken, message : "login ok", user})
    
  } catch (error) {
    console.error('Login error:', error)
      responseReturn(res,500,{error : "internal server error"})
  }
}

register = async (req: Request, res: Response): Promise<void> => {
    console.log("Registration request received");
    console.log("Request body:", req.body);
    
    const { email, password, userName } = req.body;
    let image = req.body.image || req.body.imageUrl;

    console.log("Extracted values:", { email, password, userName: userName, imageReceived: !!image });

    if (!email || !password || !userName) {
        console.log("Validation failed - missing required fields");
        responseReturn(res, 400, { error: "All fields are required" });
        return;
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User already exists with email:", email);
            responseReturn(res, 400, { error: "User already exists" });
            return;
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const profileImage = image || '/public/user.png';  

        console.log("Creating user with:", { 
            email, 
            passwordHashed: true, 
            userName, 
            image: profileImage 
        });

        const user = await User.create({
            email,
            password: hashPassword,
            userName,
            image: profileImage 
        });
        
        console.log("User created successfully");
        responseReturn(res, 200, { user, message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        responseReturn(res, 500, { error: "Something went wrong", details: error });
    }
};

   //end
refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.query;
    if (!refreshToken) {
        responseReturn(res, 400, { error: "Refresh token is required" });
        return;
    }
    try {
        const user = await User.findOne({ refreshTokens: refreshToken });
        if (!user) {
            responseReturn(res, 400, { error: "Invalid refresh token" });
            return;
        }
        const newAccessToken = await createToken({ id: user._id }, "1h");
        responseReturn(res, 200, { token: newAccessToken });
    } catch (error) {
        responseReturn(res, 500, { error: "Internal server error" });
    }
}

    logout = async (req: Request, res: Response): Promise<void> => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            responseReturn(res, 400, { error: "Refresh token is required" });
            return;
        }
        try {
            const user = await User.findOne({ refreshTokens: refreshToken });
            if (!user) {
                responseReturn(res, 400, { error: "Invalid refresh token" });
                return;
            }
            user.refreshTokens =(user.refreshTokens as string[]).filter(token => token !== refreshToken);
            await user.save();
            responseReturn(res, 200, { message: "Logout successful" });
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" });
        }
    }

    getUserInfo = async (req: Request, res: Response): Promise<void> => {
        const {userId} = req.body;
    
        const user = await User.findById(new Types.ObjectId(userId));
      
        if(user){
            const image = user.image ? user.image : null;
            const userName = user.userName ? user.userName : null;
            const userId = user._id.toString();
            responseReturn(res,200,{image, userName , userId});
            return;
        }
        else{
            responseReturn(res,400,{error : "user not found"});
        }
    }

    profileUpdate = async (req: Request, res: Response): Promise<void> => {
        const {userId,image,userName} = req.body;
    
        const user = await User.findByIdAndUpdate(new Types.ObjectId(userId), {image , userName} , {new : true});

         await postModel.updateMany({'ownerId': new Types.ObjectId(userId) },{userImg :image ,userName} , {new : true});
       
         await commentsModel.updateMany({'ownerId': new Types.ObjectId(userId) },{userImg :image ,userName} , {new : true});
      
       
        if(user){
            responseReturn(res,200,{image, userName });
            return;
        }   
        else{
            responseReturn(res,400,{error : "user not found"});
        }
    }
    googlelogin = async (req: Request, res: Response): Promise<void> => {
        const { email, name } = req.body;
        if (!email) {
            responseReturn(res, 400, { error: "Email is required" });
            return;
        }
        try {
            let user = await User.findOne({email})
            if(!user){
                user = await User.create({
                        email,
                        userName : name,
                    });
            }
            const accessToken  = await createToken({ id: user._id },"1h")
            const refreshToken = await createToken({ id: user._id }, "7d");
            user.refreshTokens = user.refreshTokens ? [...(user.refreshTokens as string[]), refreshToken] : [refreshToken];
            await user.save();
            responseReturn(res,200,{refreshToken, accessToken, message : "login ok", user})
          
        } catch (error) {
            responseReturn(res,500,{error : "internal server error"})
        }
    }

}
export default new authControllers();