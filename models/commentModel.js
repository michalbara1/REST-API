const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the post model
    required: true,
  },
  owner:{
    type:String,
    required:true,
}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;