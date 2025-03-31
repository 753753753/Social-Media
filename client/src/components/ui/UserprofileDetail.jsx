import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOtherUserPosts } from "../../api/authapi";
import { fetchFollowStats, fetchuserFollowStats, toggleFollow } from "../../features/auth/followSlice";
import UserfollowingModal from '../../modal/UserFollowingModal';
import UserfollowersModal from '../../modal/UserfollowersModal';
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
        <div className="bg-black text-white w-full px-4 py-5 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full">
                {/* Profile Info */}
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
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
                    <div className="mt-3 sm:mt-0 text-center sm:text-left">
                        <h1 className="text-lg sm:text-xl font-bold">
                            {userprofile?.userId?.name}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400">
                            {userprofile?.username || "@newuser"}
                        </p>
                        <p className="text-xs sm:text-sm mt-2">
                            {userprofile?.bio ||
                                "Updating my bio, one decade at a time."}
                        </p>
                        {/* Follow Stats */}
                        <div className="flex justify-center sm:justify-start mt-3 space-x-4">
                            <div className="flex flex-col items-center cursor-pointer">
                                <p className="font-bold text-[#5D5FEF] text-sm">{post}</p>
                                <p className="text-white text-xs">Posts</p>
                            </div>
                            <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => setShowFollowersModal(true)}
                            >
                                <p className="font-bold text-[#5D5FEF] text-sm">
                                    {userfollowingCount}
                                </p>
                                <p className="text-white text-xs">Followers</p>
                            </div>
                            <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => setShowFollowingModal(true)}
                            >
                                <p className="font-bold text-[#5D5FEF] text-sm">
                                    {userfollowersCount}
                                </p>
                                <p className="text-white text-xs">Following</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Follow Button */}
                <button
                    className={`mt-4 sm:mt-0 px-4 py-2 rounded-2xl transition cursor-pointer ${followedUsers[userid]
                            ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                            : "bg-[#877EFF] text-white hover:bg-[#877EFF]"
                        }`}
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
