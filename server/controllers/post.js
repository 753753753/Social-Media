const express = require('express');
const router = express.Router();
const userModel = require('../models/UserSchema')
const postModel = require('../models/PostSchema')
const likeModel = require('../models/LikeSchema')
const commentModel = require('../models/CommentSchema')
const savedModel = require('../models/SavedSchema')
const followModel = require('../models/FollowSchema')
const upload = require('../config/multer-config')
const isloggedin = require('../middleware/isLoggedIn')
const profileModel = require('../models/ProfileSchema')
router.get('/', (req, res) => {
    res.send("ok")
})

router.post('/uploadpost', isloggedin, upload.single('picture'), async function (req, res) {
    try {
        let { caption, location } = req.body;
        console.log(req.file)
        await postModel.create({
            image: req.file.buffer,
            caption,
            location,
            userId : req.user._id
        })
        
        res.json(true)

    } catch (error) {
        console.error("Error uploading:", error);
        res.status(500).json(false);
    }
});

router.get('/getpost', isloggedin, async (req, res) => {
    try {
        const getpost = await postModel.find().sort({ createdAt: -1 }).lean(); // Sort in descending order

        if (!getpost || getpost.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        // Fetch profile for each userId and map it to posts
        const userIds = getpost.map(post => post.userId);  // Extract userIds from posts
        const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles

        // Attach profile to each post
        const postsWithProfiles = getpost.map(post => {
            const userProfile = profiles.find(profile => profile.userId.toString() === post.userId.toString());
            return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
        });

        res.status(200).json({ success: true, posts: postsWithProfiles });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get('/getpostdetail/:id', isloggedin, async (req, res) => {
    try {
        const postId = req.params.id;
        const getpost = await postModel.find({_id: postId}).lean(); // Convert Mongoose docs to plain objects

        if (!getpost || getpost.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        // Fetch profile for each userId and map it to posts
        const userIds = getpost.map(post => post.userId);  // Extract userIds from posts
        const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles

        // Attach profile to each post
        const postsWithProfiles = getpost.map(post => {
            const userProfile = profiles.find(profile => profile.userId.toString() === post.userId.toString());
            return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
        });

        res.status(200).json({ success: true, posts: postsWithProfiles });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
module.exports = router;
