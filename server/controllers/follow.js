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
// follow
router.post("/", isloggedin, async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user._id;

    // Check if the follow is already exit
    let existing = await followModel.findOne({ followingUserId: userId, followedUserId: myId });

    if (existing) {
      // If already saved, remove it (unsave)
      await followModel.deleteOne({ followingUserId: userId, followedUserId: myId });
      return res.status(200).json({ success: false, message: "Post unsaved successfully!", follows: false });
    }

    // Otherwise, save it
    const newSave = new followModel({ followingUserId: userId, followedUserId: myId });
    await newSave.save();

    res.status(200).json({ success: true, message: "followed successfully!", follows: true });
  } catch (error) {
    console.error("Error toggling save status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get follow statistics for the logged in user
router.get("/followStats", isloggedin, async (req, res) => {
  try {
    const myId = req.user._id;

    // Get all records where I'm following someone else
    const followingDocss = await followModel.find({ followedUserId: myId });
    // Build an object mapping the IDs I follow to true
    const followedUsers = {};
    followingDocss.forEach((doc) => {
      // Here, followingUserId is the user that I follow
      followedUsers[doc.followingUserId] = true;
    });
    // Count how many people follow me (i.e., I am the target)
    const followersCount = await followModel.countDocuments({ followingUserId: myId });
    // Count how many people I follow
    const followingCount = followingDocss.length;


    // Get the all My following user 
    const followingDocs = await followModel.find({ followedUserId: myId }).populate('followingUserId').sort({ createdAt: -1 }).lean();
    const userIds = followingDocs.map(post => post.followingUserId?._id);  // Extract userIds from posts
    const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles
    const Followinguser = followingDocs.map(post => {
      const userProfile = profiles.find(profile => profile.userId.toString() === post.followingUserId?._id.toString());
      return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
    });

    // Get the all My followed user 
    const followersDocs = await followModel.find({ followingUserId: myId }).populate('followedUserId').sort({ createdAt: -1 }).lean();
    const userIdss = followersDocs.map(post => post.followedUserId?._id);  // Extract userIds from posts
    const profiless = await profileModel.find({ userId: { $in: userIdss } }).lean(); // Get profiles
    const Followuser = followersDocs.map(post => {
      const userProfiles = profiless.find(profile => profile.userId.toString() === post.followedUserId?._id.toString());
      return { ...post, userProfile: userProfiles || null }; // Attach profile or null if not found
    });

    res.status(200).json({ followedUsers, followingCount, followersCount, following: Followinguser, follower: Followuser });
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/userfollowStats/:id", isloggedin, async (req, res) => {
  try {
    const myId = req.params.id; // Get user ID from URL params

    // Get the count of users this user is following
    const userfollowingCount = await followModel.countDocuments({ followingUserId: myId });

    // Get the count of followers (users who follow this user)
    const userfollowersCount = await followModel.countDocuments({ followedUserId: myId });

    // Get the all My following user 
    const followingDocs = await followModel.find({ followedUserId: myId }).populate('followingUserId').sort({ createdAt: -1 }).lean();
    const userIds = followingDocs.map(post => post.followingUserId?._id);  // Extract userIds from posts
    const profiles = await profileModel.find({ userId: { $in: userIds } }).lean(); // Get profiles
    const Followinguser = followingDocs.map(post => {
      const userProfile = profiles.find(profile => profile.userId.toString() === post.followingUserId?._id.toString());
      return { ...post, userProfile: userProfile || null }; // Attach profile or null if not found
    });

    // Get the all My followed user 
    const followersDocs = await followModel.find({ followingUserId: myId }).populate('followedUserId').sort({ createdAt: -1 }).lean();
    const userIdss = followersDocs.map(post => post.followedUserId?._id);  // Extract userIds from posts
    const profiless = await profileModel.find({ userId: { $in: userIdss } }).lean(); // Get profiles
    const Followuser = followersDocs.map(post => {
      const userProfiles = profiless.find(profile => profile.userId.toString() === post.followedUserId?._id.toString());
      return { ...post, userProfile: userProfiles || null }; // Attach profile or null if not found
    });

    res.status(200).json({ userfollowingCount, userfollowersCount , userfollowing: Followinguser, userfollower: Followuser  });
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




module.exports = router;
