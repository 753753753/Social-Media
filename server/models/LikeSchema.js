const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "posts" , required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
}, { timestamps: true });

module.exports = mongoose.model("likes", LikeSchema)