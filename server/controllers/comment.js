const express = require('express');
const router = express.Router();
const userModel = require('../models/UserSchema')
const postModel = require('../models/PostSchema')
const likeModel = require('../models/LikeSchema')
const commentModel = require('../models/CommentSchema')
const savedModel = require('../models/SavedSchema')
const followModel = require('../models/FollowSchema')
const isloggedin = require('../middleware/isLoggedIn')
const profileModel = require('../models/ProfileSchema')

// Comment a post
router.post("/", isloggedin, async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id;

        // Otherwise, save it
        const newSave = new commentModel({ postId, userId, content: comment });
        await newSave.save();

        res.status(200).json({ success: true, message: "Post saved successfully!", iscomment: true });
    } catch (error) {
        console.error("Error toggling save status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// get comment 
router.get('/getcomment/:id', isloggedin, async (req, res) => {
    try {
        const postId = req.params.id;
        const getcomment = await commentModel.find({ postId}).sort({ createdAt: -1 }).lean(); 

        // Fetch profile for each userId and map it to posts
        const userIds = getcomment.map(post => post.userId);  // Extract userIds from posts
        const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles

        // Attach profile to each post
        const getcomments = getcomment.map(post => {
            const userProfile = profiles.find(profile => profile.userId.toString() === post.userId.toString());
            return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
        });

        res.status(200).json({ success: true, getcomment: getcomments });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
