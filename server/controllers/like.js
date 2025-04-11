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

// like a post
router.post("/", isloggedin, async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id; 

        // Check if the like is already exit
        let existing = await likeModel.findOne({ postId, userId });

        if (existing) {
            // If already saved, remove it (unsave)
            await likeModel.deleteOne({ postId, userId});
            return res.status(200).json({ success: false, message: "Post unsaved successfully!", islike: false });
        }

        // Otherwise, save it
        const newSave = new likeModel({ postId, userId});
        await newSave.save();

        res.status(200).json({ success: true, message: "Post saved successfully!", islike: true });
    } catch (error) {
        console.error("Error toggling save status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get saved like
router.get('/getlikepost', isloggedin, async (req, res) => {
    try {
        const getsavedlike = await likeModel.find({userId : req.user._id}).populate("postId").sort({ createdAt: -1 }).lean(); // Sort in descending order
        if (!getsavedlike || getsavedlike.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        // Fetch profile for each userId and map it to posts
        const userIds = getsavedlike.map(post => post.postId?.userId);  // Extract userIds from posts
        const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles

        // Attach profile to each post
        const savedlikeWithProfiles = getsavedlike.map(post => {
            const userProfile = profiles.find(profile => profile.userId.toString() === post.postId?.userId.toString());
            return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
        });

        res.status(200).json({ success: true, getsavedlike: savedlikeWithProfiles });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// gettotallike
router.get('/getlikecount', isloggedin, async (req, res) => {
    try {
        const getlike = await likeModel.find() 
    
        res.status(200).json({ success: true, getlikecount: getlike });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
