// src/components/AllsavedPost.jsx
import React, { useEffect, useState } from 'react';
import { CiHeart, CiSaveDown2 } from 'react-icons/ci';
import { FaHeart, FaRegComment } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createComment, fetchComments } from '../../features/auth/commentSlice';
import { fetchLikeData, toggleLike } from '../../features/auth/likeSlice';
import { fetchSavedData, toggleSave } from '../../features/auth/saveSlice';
const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};
function AllsavedPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Assume your posts slice contains all posts.
  const { userPosts, loading: postsLoading } = useSelector((state) => state.posts);
  // Get saved posts array from the saves slice.
  const { savedPostsArray, loading: savesLoading } = useSelector((state) => state.saves);
  // Get like data from the likes slice.
  const { likedPosts, likeCounts, loading: likesLoading } = useSelector((state) => state.likes);
  // Get comment data from the comment slice.
  const commentsByPost = useSelector((state) => state.comments.commentsByPost);
  const commentsLoading = useSelector((state) => state.comments.loading);

  // Local state for toggling comment sections, new comment text, and optimistic comments.
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [localComments, setLocalComments] = useState({});

  // Initially fetch saved posts.
  useEffect(() => {
    dispatch(fetchSavedData());
  }, [dispatch]);

  // Once savedPostsArray is available, fetch like data and comments for each post.
  useEffect(() => {
    if (Array.isArray(savedPostsArray) && savedPostsArray.length > 0) {
      const posts = savedPostsArray.map((item) => item.postId);
      // Dispatch like data for all saved posts.
      dispatch(fetchLikeData(posts));
      // Dispatch comments fetch for each saved post.
      posts.forEach((post) => {
        dispatch(fetchComments(post._id));
      });
    }
  }, [dispatch, savedPostsArray]);

  // Optionally, add a spinner if any loading is true.
  if (postsLoading || savesLoading || likesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Handlers for like, save, and comment actions.
  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
  };

  const handleSavePost = (postId) => {
    dispatch(toggleSave(postId));
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

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

    // Prepend the optimistic comment.
    setLocalComments((prev) => {
      const current = prev[postId] || [];
      return { ...prev, [postId]: [optimisticComment, ...current] };
    });

    dispatch(createComment({ postId, commentText }));
    // Clear the input.
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-4">
      {Array.isArray(savedPostsArray) && savedPostsArray.length > 0 ? (
        savedPostsArray.map((item) => {
          if (!item.postId) return null; // ✅ Skip this iteration if postId is null

          const post = item.postId;
          const isLiked = likedPosts[post._id] || false;
          const likeCount = likeCounts[post._id] || 0;
          // Combine fetched comments and optimistic comments.
          const fetchedComments = commentsByPost[post._id] || [];
          const optimisticComments = localComments[post._id] || [];
          const postComments = [...fetchedComments, ...optimisticComments];

          return (
            <div
              key={post._id}
              className="bg-black md:bg-[#09090A] flex flex-col md:rounded-2xl shadow-lg md:border md:border-[#101012] overflow-hidden"
            >
              {/* Post Image */}
              <div className="w-full h-[200px] sm:h-[250px] overflow-hidden rounded-t-lg">
                <img
                  src={`data:image/png;base64,${post.image}`}
                  alt="Post Thumbnail"
                  className="w-full h-full object-cover"
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              </div>

              {/* Below Image Section: Profile & Icons */}
              {/* Overlay Section */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between text-gray-400">
                {/* Profile Section */}
                <div className="flex items-center space-x-2 cursor-pointer relative">
                  {/* Save Icon (placed at the top-right corner) */}
                  <span
                    className="absolute top-0 right-0 p-2 cursor-pointer md:static md:ml-4"
                    onClick={() => handleSavePost(post._id)}
                  >
                    <CiSaveDown2 className="text-xl text-yellow-500 hover:text-yellow-400 transition-colors duration-200" />
                  </span>
                </div>

                {/* Like & Comment Icons */}
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  {/* Like Button */}
                  <span
                    className="flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform duration-200 text-white"
                    onClick={() => handleLikePost(post._id)}
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
                    onClick={() => toggleComments(post._id)}
                  >
                    <FaRegComment className="text-[#877EFF] text-2xl hover:text-green-400 transition-colors duration-200" />
                    <span className="text-sm font-medium">{postComments.length}</span>
                  </span>
                </div>
              </div>


              {/* Comment Section */}
              {showComments[post._id] && (
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
                      value={newComment[post._id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="ml-2 text-[#877EFF] hover:text-white text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-white text-center col-span-full">No saved posts found.</p>
      )}
    </div>
  );
}

export default AllsavedPost;
