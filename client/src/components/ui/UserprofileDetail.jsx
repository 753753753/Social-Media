import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOtherUserPosts } from "../../api/authapi";
import { fetchFollowStats, fetchuserFollowStats, toggleFollow } from "../../features/auth/followSlice";
import UserfollowersModal from '../../modal/UserfollowersModal';
import UserfollowingModal from '../../modal/UserfollowingModal';
function UserprofileDetail({ userprofile }) {
    const { userid } = useParams();
    const [post, setpost] = useState(0);
    const dispatch = useDispatch();
    // Get follow data from Redux store
    const { followedUsers, userfollowingCount, userfollowersCount, userfollowing, userfollower } = useSelector((state) => state.follows);
    const user = useSelector((state) => state.auth.user);
    const [showFollowingModal, setShowFollowingModal] = useState(false); // State for Following modal
    const [showFollowersModal, setShowFollowersModal] = useState(false); // State for Followers modal

    useEffect(() => {
        dispatch(fetchFollowStats());
        dispatch(fetchuserFollowStats(userid))
        const fetchPost = async () => {
            try {
                const result = await getOtherUserPosts(userid);
                setpost(result?.userpost?.length ?? 0)
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchPost();
    }, [userid]);

    // Handle follow/unfollow toggle
    const handleFollow = (userId) => {
        dispatch(fetchuserFollowStats(userid))
        dispatch(toggleFollow(userId));
    };


    return (
        <div className="bg-black text-white w-full px-4 sm:px-8 py-5">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                {/* Profile Info */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    {/* Profile Picture */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
                        {userprofile?.profilePicture ? (
                            <img
                                src={userprofile?.profilePicture}
                                alt={userprofile?.username || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-xl md:text-2xl font-bold">
                                {userprofile?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </div>

                    {/* User Details */}
                    <div>
                        <h1 className="text-lg md:text-xl font-bold md:pt-4">
                            {userprofile?.userId?.name}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400">
                            {userprofile?.username || "@newuser"}
                        </p>
                        <p className="text-xs md:text-sm text-white mb-2 pt-1">
                            {userprofile?.bio || "Updating my bio, one decade at a time."}
                        </p>

                        {/* Posts, Followers, and Following */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex justify-center md:justify-start text-xs md:text-sm space-x-4">
                                <div className="flex space-x-1">
                                    <p className="font-bold text-[#5D5FEF]">{post}</p>
                                    <p className="text-white">Posts</p>
                                </div>
                                {/* Followers Count */}
                                <div
                                    className="flex space-x-1 cursor-pointer"
                                    onClick={() => setShowFollowersModal(true)}
                                >
                                    <p className="font-bold text-[#5D5FEF]">{userfollowingCount}</p>
                                    <p className="text-white">Followers</p>
                                </div>
                                {/* Following Count */}
                                <div
                                    className="flex space-x-1 cursor-pointer"
                                    onClick={() => setShowFollowingModal(true)}
                                >
                                    <p className="font-bold text-[#5D5FEF]">{userfollowersCount}</p>
                                    <p className="text-white">Following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Follow Button */}
                <button
                    className={`bg-[#1F1F22] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition cursor-pointer flex items-center gap-2 ${followedUsers[userid] ? "border border-gray-300 bg-white text-black hover:bg-gray-100" : "bg-[#877EFF] text-white hover:bg-[#6A5AE0]"}`}
                    onClick={() => handleFollow(userid)}
                >
                    {followedUsers[userid] ? "Following" : "Follow"}
                </button>
            </div>

            {/* Following Modal */}
            <UserfollowingModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                following={userfollowing}
                followedUsers={followedUsers}
                users={user?.user}
            />

            {/* Followers Modal */}
            <UserfollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                follower={userfollower}
                followedUsers={followedUsers}
                users={user?.user}
            />
        </div>

    )
}

export default UserprofileDetail
