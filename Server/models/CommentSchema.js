const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true },
  }, { timestamps: true });

module.exports = mongoose.model("comments", CommentSchema)