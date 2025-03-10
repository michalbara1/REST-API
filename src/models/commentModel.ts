import {Schema,model} from 'mongoose'

const commentSchema =new Schema({
   
    content:{
        type: String,
        required :true
    },
    postId:{
        type: Schema.ObjectId,
        required :true
    },
    ownerId:{
        type: Schema.ObjectId,
        required :true
    },
    userName:{
        type: String,
        required :true
    },
    img:{
        type: String,
        required :true
    },
})

export default model('comment', commentSchema);