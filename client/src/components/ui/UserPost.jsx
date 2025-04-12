import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createComment, fetchComments } from "../../features/auth/commentSlice";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { fetchotherPosts } from "../../features/auth/postSlice";
import { toggleSave } from "../../features/auth/saveSlice";

const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

const UserPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userid } = useParams();

  // Local states for comment toggling and new comment input.
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [localComments, setLocalComments] = useState({});

  // Get posts and like data from Redux
  const { userPosts, loading: postsLoading, error } = useSelector((state) => state.posts);
  const { likedPosts, likeCounts, loading: likesLoading } = useSelector((state) => state.likes);
  const { savedPosts } = useSelector((state) => state.saves);
  const commentsByPost = useSelector((state) => state.comments.commentsByPost);
  const commentsLoading = useSelector((state) => state.comments.loading);
  const user = useSelector((state) => state.auth.user);
  // Fetch posts for the given user id
  useEffect(() => {
    if (userid) {
      dispatch(fetchotherPosts(userid));
    }
  }, [dispatch, userid]);

  console.log(userPosts)

  // Fetch like data and comments for each post once posts are available.


  useEffect(() => {
    if (Array.isArray(userPosts) && userPosts.length > 0) {
      const posts = userPosts.map((item) => item._id);

      dispatch(fetchLikeData(posts));

      posts.forEach((postId) => {
        dispatch(fetchComments(postId));
      });
    }
  }, [dispatch, userPosts]);


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

    setLocalComments((prev) => {
      const current = prev[postId] || [];
      return { ...prev, [postId]: [optimisticComment, ...current] };
    });

    dispatch(createComment({ postId, commentText }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  if (postsLoading || likesLoading) {
    return (
      <div className="flex justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-black text-white">Error: {error}</div>;
  }

  return (
<div className="w-full py-6 px-4 bg-black">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto items-start">
    {userPosts.map((post) => {
      const isLiked = likedPosts[post._id];
      const likeCount = likeCounts[post._id] || 0;
      const fetchedComments = commentsByPost[post._id] || [];
      const optimisticComments = localComments[post._id] || [];
      const postComments = [...fetchedComments, ...optimisticComments];

      return (
        <div
          key={post._id}
          className="bg-[#09090A] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-md flex flex-col"
        >
          {/* Post Image */}
          <div
            className="h-[250px] sm:h-[300px] cursor-pointer"
            onClick={() => navigate(`/post/${post._id}/user/${post.userId._id}`)}
          >
            <img
              src={post.image}
              alt="Post Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Icons and Actions */}
          <div className="flex justify-between items-center px-4 py-2 text-white">
            <div className="flex gap-4 items-center">
              <span
                className="flex items-center gap-1 cursor-pointer hover:scale-110 transition"
                onClick={() => handleLikePost(post._id)}
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
                onClick={() => toggleComments(post._id)}
              >
                <FaRegComment className="text-[#877EFF] text-lg" />
                <span className="text-sm">{postComments.length}</span>
              </span>
            </div>

            <span onClick={() => handleSavePost(post._id)} className="cursor-pointer">
              {savedPosts[post._id] ? (
                <CiSaveDown2 className="text-yellow-500 text-xl" />
              ) : (
                <CiSaveUp2 className="text-[#877EFF] text-xl hover:text-yellow-500" />
              )}
            </span>
          </div>

            {/* Comments Section */}
            {showComments[post._id] && (
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
                    className="ml-1 md:ml-2 text-[#877EFF] hover:text-white text-sm"
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
</div>

  );
};

export default UserPost;
