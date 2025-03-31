const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
    followingUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    followedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  }, { timestamps: true });
  
module.exports = mongoose.model("follows", FollowSchema)
