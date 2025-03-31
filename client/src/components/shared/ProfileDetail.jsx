import React, { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFollowStats } from "../../features/auth/followSlice";
import { fetchUserPosts } from '../../features/auth/postSlice';
import { fetchProfile } from '../../features/auth/profileSlice';
import FollowersModal from '../../modal/FollowersModal'; // New Followers Modal
import FollowingModal from '../../modal/FollowingModal';

function ProfileDetail({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showFollowingModal, setShowFollowingModal] = useState(false); // State for Following modal
    const [showFollowersModal, setShowFollowersModal] = useState(false); // State for Followers modal

    // Select data from Redux store
    const { data: profile, loading: profileLoading } = useSelector((state) => state.profile);
    const { count: postCount, loading: postsLoading } = useSelector((state) => state.posts);
    const { followingCount, followersCount, following, followedUsers, follower } = useSelector((state) => state.follows);

    useEffect(() => {
        dispatch(fetchFollowStats());
        dispatch(fetchProfile());
        dispatch(fetchUserPosts());
    }, [dispatch]);

    return (
        <div className="bg-black text-white w-full px-4 sm:px-8 py-5">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                {/* Profile Info */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    {/* Profile Picture */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
                        {profileLoading ? (
                            <span>Loading...</span>
                        ) : profile?.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt={profile?.username || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-xl md:text-2xl font-bold">
                                {profile?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </div>

                    {/* User Details */}
                    <div>
                        <h1 className="text-lg md:text-xl font-bold md:pt-4">
                            {profile?.userId?.name || user?.name}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400">
                            {profile?.username || "@newuser"}
                        </p>
                        <p className="text-xs md:text-sm text-white mb-2 pt-1">
                            {profile?.bio ||
                                "Updating my bio, one decade at a time."}
                        </p>

                        {/* Posts, Followers, and Following */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex justify-center md:justify-start text-xs md:text-sm space-x-4">
                                <div className="flex space-x-1">
                                    <p className="font-bold text-[#5D5FEF]">
                                        {postsLoading ? "..." : postCount}
                                    </p>
                                    <p className="text-white">Posts</p>
                                </div>
                                {/* Followers Count */}
                                <div
                                    className="flex space-x-1 cursor-pointer"
                                    onClick={() => setShowFollowersModal(true)}
                                >
                                    <p className="font-bold text-[#5D5FEF]">{followersCount}</p>
                                    <p className="text-white">Followers</p>
                                </div>
                                {/* Following Count */}
                                <div
                                    className="flex space-x-1 cursor-pointer"
                                    onClick={() => setShowFollowingModal(true)}
                                >
                                    <p className="font-bold text-[#5D5FEF]">{followingCount}</p>
                                    <p className="text-white">Following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <button
                    className="bg-[#1F1F22] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition cursor-pointer flex items-center gap-2"
                    onClick={() => navigate(`/editprofile`)}
                >
                    <FaRegEdit className="text-indigo-500" /> Edit Profile
                </button>
            </div>

            {/* Following Modal */}
            <FollowingModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                following={following}
                followedUsers={followedUsers}
            />

            {/* Followers Modal */}
            <FollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                follower={follower}
                followedUsers={followedUsers}
            />
        </div>

    );
}

export default ProfileDetail;
