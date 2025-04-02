const express = require('express');
const router = express.Router();
const userModel = require('../models/UserSchema')
const postModel = require('../models/PostSchema')
const likeModel = require('../models/LikeSchema')
const commentModel = require('../models/CommentSchema')
const savedModel = require('../models/SavedSchema')
const followModel = require('../models/FollowSchema')
const profileModel = require('../models/ProfileSchema')
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/generateToken")
const isloggedin = require('../middleware/isLoggedIn')
const upload = require('../config/multer-config')

router.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (user) return res.json(false);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user = await userModel.create({
            name,
            email,
            password: hash
        });

        let token = generateToken(user);
        //  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure in production
            sameSite: "None"
        });

        res.json(true);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    console.log("entering")
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        console.log(user);
        if (!user) return res.json(false);

        bcrypt.compare(password, user.password, function (err, result) {

            if (!result) {
                return res.json(false)
            }
            let token = generateToken(user);
            // res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set secure in production
                sameSite: "None"
            });            
            res.json(true)
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }

    console.log("exit")
});

router.get('/logout', async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            expires: new Date(0) // Expire the cookie
        });
        // res.cookie("token", "");
        res.json(true)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/check-auth', isloggedin, async (req, res) => {
    console.log("inside-check-auth")
    try {
        // Assuming req.user is already set by your authentication middleware.
        const profile = await profileModel.findOne({ userId: req.user._id });
        res.json({ isAuthenticated: true, user: req.user, profile });
    } catch (error) {
        res.status(500).json({ isAuthenticated: false, error: error.message });
    }
    console.log("exist check-auth")
});

router.post('/updateprofile', isloggedin, upload.single('image'), async (req, res) => {
    try {
        const { username, bio, name } = req.body;
        console.log(req.file)
        const profilePicture = req.file ? req.file.buffer : null;  // Check if file exists
        await userModel.findOneAndUpdate({ _id: req.user._id }, { name });
        const updatedProfile = await profileModel.findOneAndUpdate(
            { userId: req.user._id },
            { username, bio, ...(profilePicture && { profilePicture }) }, // Only update if picture exists
            { new: true, upsert: true }
        ).populate("userId");

        res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
});


router.get('/getprofile', isloggedin, async (req, res) => {

    try {
        const getprofile = await profileModel.findOne({ userId: req.user._id }).populate("userId");
        res.status(200).json({ success: true, profile: getprofile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Profile not found" });
    }
})

router.get('/getposts', isloggedin, async (req, res) => {

    try {
        const getposts = await postModel.find({ userId: req.user._id }).populate("userId");
        res.status(200).json({ success: true, userpost: getposts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Profile not found" });
    }
})

router.get('/getallprofile', isloggedin, async (req, res) => {
    try {
        // Get all user documents.
        const getallprofile = await userModel.find();

        // Exclude the logged-in user's document.
        const filteredUsers = getallprofile.filter(
            (user) => user._id.toString() !== req.user._id.toString()
        );

        // Extract user IDs from the filtered users.
        const userIds = filteredUsers.map((user) => user._id);

        // Get profiles for these users.
        const profiles = await profileModel.find({ userId: { $in: userIds } }).lean();

        // Attach the profile to each user.
        const getalluser = filteredUsers.map((user) => {
            const userProfile = profiles.find(
                (profile) => profile.userId.toString() === user._id.toString()
            );
            return { ...user.toObject(), userProfile: userProfile || null };
        });

        res.status(200).json({ success: true, getallprofile: getalluser });
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ success: false, message: "Profile not found" });
    }
});


router.get('/getuserprofile/:id', isloggedin, async (req, res) => {
    try {
        const userId = req.params.id;
        const getuserprofile = await profileModel.findOne({ userId: userId }).populate("userId");
        res.status(200).json({ success: true, getuserprofile: getuserprofile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Profile not found" });
    }
})


router.get('/getuserposts/:id', isloggedin, async (req, res) => {

    try {
        const getposts = await postModel.find({ userId: req.params.id }).populate("userId");
        res.status(200).json({ success: true, userpost: getposts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Profile not found" });
    }
})
module.exports = router;
