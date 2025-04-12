import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createComment, fetchComments } from "../../features/auth/commentSlice";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { toggleSave } from "../../features/auth/saveSlice";

const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};
function ExplorePost({ posts }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Like and save states
  const { likedPosts, likeCounts, loading: likesLoading } = useSelector(
    (state) => state.likes
  );
  const savedPosts = useSelector((state) => state.saves.savedPosts);

  // Comment states
  const commentsByPost = useSelector(
    (state) => state.comments.commentsByPost
  );
  const commentsLoading = useSelector((state) => state.comments.loading);

  // Local state for toggling comment sections and new comment text per post.
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  // Local state for optimistically added comments per post.
  const [localComments, setLocalComments] = useState({});

  // Fetch likes and saved posts when posts are available.
  useEffect(() => {
    if (posts.length > 0) {
      dispatch(fetchLikeData(posts));
    }
  }, [dispatch, posts]);

  // Fetch comments for all posts.
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(fetchComments(post._id));
      });
    }
  }, [dispatch, posts]);

  // Handle like toggle.
  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
  };

  // Handle save toggle.
  const handleSavePost = (postId) => {
    dispatch(toggleSave(postId));
  };

  // Toggle comments section for a given post.
  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Handle adding a comment with an optimistic update.
  const handleAddComment = (postId) => {
    if (!newComment[postId] || newComment[postId].trim() === "") return;
    const commentText = newComment[postId].trim();

    const optimisticComment = {
      content: commentText,
      userProfile: {
        username: user?.profile?.username || "@newuser",
        profilePicture: user?.profile?.profilePicture
          ? bufferToBase64(user.profile.profilePicture)
          : "",
      },
    };

    // Prepend the optimistic comment so it appears at the top.
    setLocalComments((prev) => {
      const current = prev[postId] || [];
      return { ...prev, [postId]: [optimisticComment, ...current] };
    });

    dispatch(createComment({ postId, commentText }));

    // Clear input for this post.
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  if (likesLoading) {
    return (
      <div className="flex justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const postId = post._id;
        const isLiked = likedPosts[postId];
        const likeCount = likeCounts[postId] || 0;
        const isSaved = savedPosts[postId];

        // Combine fetched comments and optimistic comments.
        const fetchedComments = commentsByPost[postId] || [];
        const optimisticComments = localComments[postId] || [];
        const postComments = [...fetchedComments, ...optimisticComments];

        return (
          <div
            key={postId}
            className="bg-black md:bg-[#09090A] flex flex-col md:rounded-2xl shadow-lg md:border md:border-[#101012] overflow-hidden"
          >
            {/* Image Container */}
            <div className="w-full h-[200px] sm:h-[250px] overflow-hidden rounded-t-lg">
              <img
                src={`data:image/png;base64,${post.image}`}
                alt="Post Thumbnail"
                className="w-full h-full object-cover"
                onClick={() => navigate(`/post/${post._id}/user/${post.userId}`)}
              />
            </div>

            {/* Overlay Section */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between text-gray-400">
              {/* Profile Section */}
              <div className="flex items-center space-x-2 cursor-pointer relative">
                {/* Save Icon */}
                <span
                  className="absolute top-0 right-0 p-2 cursor-pointer md:static md:ml-4"
                  onClick={() => handleSavePost(postId)}
                >
                  {!isSaved ? (
                    <CiSaveUp2 className="text-[#877EFF] text-xl hover:text-yellow-500 transition-colors duration-200" />
                  ) : (
                    <CiSaveDown2 className="text-xl text-yellow-500" />
                  )}
                </span>
              </div>

              {/* Like & Comment Icons */}
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                {/* Like Button */}
                <span
                  className="text-white cursor-pointer flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                  onClick={() => handleLikePost(postId)}
                >
                  {!isLiked ? (
                    <CiHeart className="text-[#877EFF] text-2xl hover:text-red-500 transition-colors duration-200" />
                  ) : (
                    <FaHeart className="text-red-500 text-2xl" />
                  )}
                  <span className="text-sm font-medium">{likeCount > 0 ? likeCount : ""}</span>
                </span>

                {/* Comment Button */}
                <span
                  className="flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform duration-200 text-white"
                  onClick={() => toggleComments(postId)}
                >
                  <FaRegComment className="text-[#877EFF] text-2xl hover:text-green-400 transition-colors duration-200" />
                  <span className="text-sm font-medium">{postComments.length}</span>
                </span>
              </div>
            </div>


            {/* Comment Section */}
            {showComments[postId] && (
              <div className="px-4 pb-4 bg-[#09090A]">
                {commentsLoading ? (
                  <p className="text-gray-300 text-sm">Loading comments...</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
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
                                {comment.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div className="bg-gray-800 p-1 rounded-xl flex items-center px-2">
                            <p className="text-gray-300 text-sm">
                              <span className="font-bold">
                                {comment.userProfile?.username || "@newuser"}:
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
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-[#09090A] text-gray-300 p-2 rounded-lg focus:outline-none text-sm"
                    value={newComment[postId] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [postId]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleAddComment(postId)}
                    className="ml-2 text-[#877EFF] hover:text-white text-sm"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExplorePost;
