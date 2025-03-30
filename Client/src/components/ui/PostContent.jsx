import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createComment, fetchComments } from "../../features/auth/commentSlice";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { fetchPostDetail } from "../../features/auth/postSlice";
import { fetchSavedData, toggleSave } from "../../features/auth/saveSlice";
// Helper to convert a Buffer to a Base64 string.
const bufferToBase64 = (bufferObj) => {
    if (!bufferObj || !bufferObj.data) return "";
    const uint8Arr = new Uint8Array(bufferObj.data);
    let binary = "";
    uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
};

function PostContent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Select logged-in user from auth slice.
    const user = useSelector((state) => state.auth.user);

    // Redux state selectors
    const { postDetail, loading, error } = useSelector((state) => state.posts);
    const { likedPosts, likeCounts, loading: likesLoading } = useSelector((state) => state.likes);
    const savedPosts = useSelector((state) => state.saves.savedPosts);
    const commentsByPost = useSelector((state) => state.comments.commentsByPost);
    const commentsLoading = useSelector((state) => state.comments.loading);

    // Local state for toggling comment sections and new comment text per post
    const [showComments, setShowComments] = useState({});
    const [newComment, setNewComment] = useState({});
    // Local state for optimistically added comments per post
    const [localComments, setLocalComments] = useState({});


    // Fetch post detail on mount.
    useEffect(() => {
        if (id) {
            dispatch(fetchPostDetail(id));
        }
    }, [dispatch, id]);

    // When postDetail is loaded, fetch like, saved, and comment data.
    useEffect(() => {
        if (postDetail) {
            dispatch(fetchLikeData([postDetail])); // pass as an array
            dispatch(fetchSavedData());
            dispatch(fetchComments(postDetail._id));
        }
    }, [dispatch, postDetail]);

    // Handlers for like and save toggles.
    const handleLikePost = (postId) => {
        dispatch(toggleLike(postId));
    };

    const handleSavePost = (postId) => {
        dispatch(toggleSave(postId));
    };
    // Toggle comments section for a given post.
    const toggleComments = (postId) => {
        setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };
    // Handler for adding a comment.
    const handleAddComment = (postId) => {

        if (!newComment[postId] || newComment[postId].trim() === "") return;
        const commentText = newComment[postId].trim();

        // Create an optimistic comment using logged-in user's info.
        const optimisticComment = {
            content: commentText,
            userProfile: {
                username: user?.profile?.username || "You",
                profilePicture: user?.profile?.profilePicture
                    ? bufferToBase64(user.profile.profilePicture)
                    : "",
            },
        };

        // Update localComments immediately so the comment appears
        setLocalComments((prev) => {
            const current = prev[postId] || [];
            return { ...prev, [postId]: [...current, optimisticComment] };
        });

        // Dispatch the createComment thunk to update the server
        dispatch(createComment({ postId, commentText }));

        // Clear input for this postDetail.
        setNewComment((prev) => ({ ...prev, [postId]: "" }));
    };

    if (loading || likesLoading) {
        return (
            <div className="flex justify-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!postDetail) {
        return <div>No post found.</div>;
    }

    const isLiked = likedPosts[postDetail._id];
    const likeCount = likeCounts[postDetail._id] || 0;
    const isSaved = savedPosts[postDetail._id];
    // Combine fetched comments and optimistic comments
    const fetchedComments = commentsByPost[postDetail._id] || [];
    const optimisticComments = localComments[postDetail._id] || [];
    const postComments = [...fetchedComments, ...optimisticComments];
    // For displaying profile picture of post owner, convert if needed.


    const ownerProfilePic = postDetail.userProfile?.profilePicture;
    const ownerProfilePicBase64 =
        typeof ownerProfilePic === "object" ? bufferToBase64(ownerProfilePic) : ownerProfilePic;

    return (
        <div className="border border-[#101012] rounded-2xl w-full max-w-lg sm:max-w-3xl mx-auto p-0 md:p-4 bg-[#000000] text-white">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                {/* Left Section: Post Image */}
                <div className="w-full sm:w-[52%]">
                    <div className="bg-[#000000] p-0 md:p-2 rounded-2xl shadow-lg">
                        <img
                            src={`data:image/png;base64,${postDetail.image}`}
                            alt="Post"
                            className="rounded-lg w-full h-full"
                        />
                    </div>
                </div>
                {/* Right Section: Post Details */}
                <div className="w-full sm:w-[48%] flex flex-col rounded-2xl bg-black md:bg-[#09090A] p-4">
                    {/* Profile Section */}
                    <div
                        className="flex items-center mb-3 md:mb-4 space-x-2 cursor-pointer"
                        onClick={() =>
                    // If the post's userId matches the logged-in user's ID, navigate to "/profile"
                    postDetail.userId === user?.user?._id
                      ? navigate('/profile')
                      : navigate(`/user/${postDetail.userId}`)
                  }
                    >
                        <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
                            {ownerProfilePicBase64 ? (
                                <img
                                    src={`data:image/png;base64,${ownerProfilePicBase64}`}
                                    alt={postDetail.userProfile?.username || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-xl md:text-2xl font-bold">
                                    {postDetail.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm md:text-md font-bold">
                                {postDetail.userProfile?.username || "@newuser"}
                            </h2>
                            <p className="text-gray-400 text-xs md:text-xs">
                                {new Date(postDetail.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {/* Post Content */}
                    <div className="mb-6 border-t border-[#1F1F22] pt-4">
                        <h2 className="text-xs sm:text-sm leading-relaxed">
                            {postDetail.caption}
                        </h2>
                    </div>
                    {/* Like, Comment & Save Section */}
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                        <div className="flex items-center gap-4">
                            <span
                                className="text-white cursor-pointer flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                                onClick={() => handleLikePost(postDetail._id)}
                            >
                                {!isLiked ? (
                                    <CiHeart className="text-[#877EFF] text-2xl" />
                                ) : (
                                    <FaHeart className="text-red-500 text-2xl" />
                                )}
                                <span className="text-sm font-medium">
                                    {likeCount > 0 ? likeCount : ""}
                                </span>
                            </span>

                            {/* Comment Icon */}
                            <span
                                className="text-white cursor-pointer flex items-center gap-1"
                                onClick={() => toggleComments(postDetail._id)}
                            >
                                <FaRegComment className="text-[#877EFF] text-2xl" />
                                <span className="text-sm font-medium">
                                    {postComments.length}
                                </span>
                            </span>
                        </div>

                        {/* Save Icon */}
                        <span
                            className="cursor-pointer"
                            onClick={() => handleSavePost(postDetail._id)}
                        >
                            {!isSaved ? (
                                <CiSaveUp2 className="text-[#877EFF] text-2xl hover:text-yellow-500" />
                            ) : (
                                <CiSaveDown2 className="text-2xl text-yellow-500" />
                            )}
                        </span>
                    </div>

                    {/* Comment Section */}
                    {showComments[postDetail._id] && (
                        <div className="mt-4">
                            {commentsLoading ? (
                                <p className="text-gray-300">Loading comments...</p>
                            ) : (
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                    {postComments.length > 0 ? (
                                        postComments.map((comment, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-500 overflow-hidden border">
                                                    {comment.userProfile?.profilePicture ? (
                                                        <img
                                                            src={`data:image/png;base64,${comment.userProfile.profilePicture}`}
                                                            alt={comment.userProfile.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white text-sm font-bold flex items-center justify-center h-full">
                                                            {comment.userProfile?.username?.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="bg-gray-800 p-1 rounded-xl flex space-x-1.5 text-center px-2">
                                                    <p className="text-gray-300 text-sm">
                                                        <span className="font-bold">
                                                            {comment.userProfile?.username}:
                                                        </span>{" "}
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-300 text-sm">No comments yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Add Comment Input */}
                            <div className="mt-3 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-[#1A1A1B] text-gray-300 p-2 rounded-lg focus:outline-none"
                                    value={newComment[postDetail._id] || ""}
                                    onChange={(e) =>
                                        setNewComment((prev) => ({
                                            ...prev,
                                            [postDetail._id]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    onClick={() => handleAddComment(postDetail._id)}
                                    className="ml-2 text-[#877EFF] hover:text-white"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostContent;
