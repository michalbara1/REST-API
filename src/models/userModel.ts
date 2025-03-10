import mongoose, { Schema, Document, model } from 'mongoose';


const UserSchema =new Schema({
    email:{
        type: String,
        required :true,
        unique: true
    },
    password:{
        type: String,
        required :false
    },
    refreshTokens: {
         type: [String], default: [] 
    },
    image:{
        type: String,
        default: '/public/user.png'
    },
    userName:{
        type: String,
        required :true,
    }
})

export default model('user', UserSchema);