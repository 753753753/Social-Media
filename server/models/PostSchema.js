const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    caption: { type: String},
    location: { type: String },
    image: { type: Buffer },
  }, { timestamps: true });

module.exports = mongoose.model("posts" , PostSchema)