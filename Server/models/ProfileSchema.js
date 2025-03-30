const mongoose = require('mongoose')

const ProfileSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: "I Love my self" },
    profilePicture: { type: Buffer },
}, { timestamps: true })

module.exports = mongoose.model("profiles", ProfileSchema)