import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createComment, fetchComments } from "../../features/auth/commentSlice";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { fetchallPosts } from "../../features/auth/postSlice";
import { fetchSavedData, toggleSave } from "../../features/auth/saveSlice";
// Helper to convert a Buffer to a Base64 string.
const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

function PostCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select logged-in user from auth slice.
  // Assuming the logged in user object has a structure like { user: { _id, name, ... }, profile: { username, profilePicture, ... } }
  const user = useSelector((state) => state.auth.user);
  // Redux state selectors.
  const { allPosts, loading: postsLoading } = useSelector((state) => state.posts);
  const { likedPosts, likeCounts, loading: likesLoading } = useSelector((state) => state.likes);
  const savedPosts = useSelector((state) => state.saves.savedPosts);
  const commentsByPost = useSelector((state) => state.comments.commentsByPost);
  const commentsLoading = useSelector((state) => state.comments.loading);

  // Local state for toggling comment sections and new comment text per post.
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  // Local state for optimistically added comments per post.
  const [localComments, setLocalComments] = useState({});

  useEffect(() => {
    dispatch(fetchallPosts());
    dispatch(fetchSavedData());
  }, [dispatch]);

  // When posts are loaded, fetch like data.
  useEffect(() => {
    if (allPosts.length > 0) {
      dispatch(fetchLikeData(allPosts));
    }
  }, [dispatch, allPosts]);

  // Auto-fetch comments for all posts when loaded.
  useEffect(() => {
    if (allPosts.length > 0) {
      allPosts.forEach((post) => {
        dispatch(fetchComments(post._id));
      });
    }
  }, [dispatch, allPosts]);

  // Handle like toggle for a specific post.
  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
  };

  // Handle save toggle for a specific post.
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

  if (postsLoading || likesLoading) {
    return (
      <div className="flex justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {allPosts.map((post) => {
        const isLiked = likedPosts[post._id];
        const likeCount = likeCounts[post._id] || 0;
        const isSaved = savedPosts[post._id];

        // Combine fetched comments and optimistic comments.
        const fetchedComments = commentsByPost[post._id] || [];
        const optimisticComments = localComments[post._id] || [];
        const postComments = [...fetchedComments, ...optimisticComments];

        return (
          <div className="w-full md:w-[30rem] lg:w-[35rem] xl:w-[35rem] cursor-pointer">
            <div className="bg-black md:bg-[#09090A] md:p-6 rounded-2xl mb-6 shadow-lg md:border md:border-[#101012]" key={post._id}>
              <div className="pl-1 md:pl-0">
                {/* Profile Section */}
                <div
                  className="flex items-center mb-3 space-x-2"
                  onClick={() =>
                    post.userId === user?.user?._id
                      ? navigate('/profile')
                      : navigate(`/user/${post.userId}`)
                  }
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden border-2 border-white">
                    {post.userProfile?.profilePicture ? (
                      <img
                        src={`data:image/png;base64,${post.userProfile.profilePicture}`}
                        alt={post.userProfile?.username || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">
                        {post.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">
                      {post.userProfile?.username || ""}
                    </h2>
                    <p className="text-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Caption */}
                <p className="text-gray-200 mb-3 flex items-center pl-2 md:pl-0">
                  {post.location && (
                    <>
                      <IoLocation className="mr-1" /> {post.location}
                    </>
                  )}
                </p>
              </div>

              {/* Post Image - Full Width on Mobile */}
              {post.image && (
                <img
                  src={`data:image/png;base64,${post.image}`}
                  alt="Post"
                  className="w-full h-auto max-h-[80vh] object-cover rounded-none md:rounded-lg"
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              )}

              {/* Like, Comment & Save Section */}
              <div className="flex items-center justify-between text-gray-400 text-sm p-3">
                <div className="flex items-center gap-4">
                  <span
                    className="text-white cursor-pointer flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                    onClick={() => handleLikePost(post._id)}
                  >
                    {!isLiked ? (
                      <CiHeart className="text-[#877EFF] text-2xl" />
                    ) : (
                      <FaHeart className="text-red-500 text-2xl" />
                    )}
                    <span className="text-sm font-medium">{likeCount > 0 ? likeCount : ""}</span>
                  </span>

                  {/* Comment Icon */}
                  <span
                    className="text-white cursor-pointer flex items-center gap-1"
                    onClick={() => toggleComments(post._id)}
                  >
                    <FaRegComment className="text-[#877EFF] text-2xl" />
                    <span className="text-sm font-medium">{postComments.length}</span>
                  </span>
                </div>

                {/* Save Icon */}
                <span
                  className="cursor-pointer"
                  onClick={() => handleSavePost(post._id)}
                >
                  {!isSaved ? (
                    <CiSaveUp2 className="text-[#877EFF] text-2xl hover:text-yellow-500" />
                  ) : (
                    <CiSaveDown2 className="text-2xl text-yellow-500" />
                  )}
                </span>
              </div>

              {/* Comment Section */}
              {showComments[post._id] && (
                <div className="mt-4 p-3">
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
                                  {comment.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                                </span>
                              )}
                            </div>
                            <div className="bg-gray-800 p-1 rounded-xl flex space-x-1.5 text-center px-2">
                              <p className="text-gray-300 text-sm">
                                <span className="font-bold">
                                  {comment.userProfile?.username || "@newuser"} :
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
                      className="ml-2 text-[#877EFF] hover:text-white"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PostCard;
