import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createComment, fetchComments } from "../../features/auth/commentSlice";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { fetchSavedData, toggleSave } from "../../features/auth/saveSlice";

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
  const { savedPostsArray } = useSelector((state) => state.saves);
  const { likedPosts, likeCounts } = useSelector((state) => state.likes);
  const commentsByPost = useSelector((state) => state.comments.commentsByPost);
  const commentsLoading = useSelector((state) => state.comments.loading);
  const hasFetchedsavedpost = useSelector((state) => state.saves.hasFetchedsavedpost);

  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [localComments, setLocalComments] = useState({});

  useEffect(() => {
    if (!hasFetchedsavedpost) {
      dispatch(fetchSavedData());
    }
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(savedPostsArray) && savedPostsArray.length > 0) {
      const posts = savedPostsArray.map((item) => item.postId);
      dispatch(fetchLikeData(posts));
      posts.forEach((post) => dispatch(fetchComments(post._id)));
    }
  }, [dispatch, savedPostsArray]);

  const handleLikePost = (postId) => dispatch(toggleLike(postId));
  const handleSavePost = (postId) => dispatch(toggleSave(postId));
  const toggleComments = (postId) => setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const handleAddComment = (postId) => {
    if (!newComment[postId] || newComment[postId].trim() === "") return;
    const commentText = newComment[postId].trim();
    const optimisticComment = {
      content: commentText,
      userProfile: {
        username: user?.profile?.username || "@newuser",
        profilePicture: user?.profile?.profilePicture ? bufferToBase64(user.profile.profilePicture) : "",
      },
    };
    setLocalComments((prev) => ({ ...prev, [postId]: [optimisticComment, ...(prev[postId] || [])] }));
    dispatch(createComment({ postId, commentText }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
<div className="w-full py-6 px-4 bg-black">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto items-start">
    {Array.isArray(savedPostsArray) && savedPostsArray.length > 0 ? (
      savedPostsArray.map((item) => {
        if (!item.postId) return null;
        const post = item.postId;
        const postId = post._id;
        const isLiked = likedPosts[postId];
        const likeCount = likeCounts[postId] || 0;
        const fetchedComments = commentsByPost[postId] || [];
        const optimisticComments = localComments[postId] || [];
        const postComments = [...fetchedComments, ...optimisticComments];

        return (
          <div
            key={postId}
            className="bg-[#09090A] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-md flex flex-col"
          >
            {/* Post Image */}
            <div
              className="h-[250px] sm:h-[300px] cursor-pointer"
              onClick={() => navigate(`/post/${postId}`)}
            >
              <img
                src={`data:image/png;base64,${post.image}`}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Icons and Actions */}
            <div className="flex justify-between items-center px-4 py-2 text-white">
              <div className="flex gap-4 items-center">
                <span
                  className="flex items-center gap-1 cursor-pointer hover:scale-110 transition"
                  onClick={() => handleLikePost(postId)}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <CiHeart className="text-[#877EFF] text-2xl" />
                  )}
                  <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
                </span>

                <span
                  className="flex items-center gap-1 cursor-pointer hover:scale-110 transition"
                  onClick={() => toggleComments(postId)}
                >
                  <FaRegComment className="text-[#877EFF] text-lg" />
                  <span className="text-sm">{postComments.length}</span>
                </span>
              </div>

              <span onClick={() => handleSavePost(postId)} className="cursor-pointer">
                <CiSaveDown2 className="text-yellow-500 text-xl hover:text-yellow-400" />
              </span>
            </div>
          {/* Comments Section */}
          {showComments[postId] && (
              <div className="px-4 pb-4 text-sm text-white space-y-2">
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {commentsLoading ? (
                    <p className="text-gray-400">Loading comments...</p>
                  ) : postComments.length > 0 ? (
                    postComments.map((comment, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                          {comment.userProfile?.profilePicture ? (
                            <img
                              src={`data:image/png;base64,${comment.userProfile.profilePicture}`}
                              alt="User"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-sm font-bold">
                              {comment.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="bg-[#1a1a1a] px-3 py-1 rounded-xl text-gray-300">
                          <span className="font-semibold">
                            {comment.userProfile?.username || "@user"}:
                          </span>{" "}
                          {comment.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No comments yet.</p>
                  )}
                </div>
  
                {/* Add Comment Input */}
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 bg-[#1a1a1a] px-1 md:px-3 py-2 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none"
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
                    className="ml-1 md:ml-2 text-[#877EFF] hover:text-white text-sm"
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
</div>

  );
}

export default AllsavedPost;