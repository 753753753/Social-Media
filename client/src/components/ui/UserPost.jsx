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
    <div className="py-4 px-0 md:px-4 bg-black w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {userPosts.map((post) => {
          const isLiked = likedPosts[post._id];
          const likeCount = likeCounts[post._id] || 0;
          // Merge fetched and optimistic comments.
          const fetchedComments = commentsByPost[post._id] || [];
          const optimisticComments = localComments[post._id] || [];
          const postComments = [...fetchedComments, ...optimisticComments];

          return (
            <div
              key={post._id}
              className="bg-black md:bg-[#09090A] flex flex-col rounded-2xl shadow-lg border border-[#101012] overflow-hidden mt-10"
            >
              {/* Image Container */}
              <div className="w-full h-[200px] sm:h-[250px] overflow-hidden rounded-t-lg">
                <img
                  src={post.image}
                  alt="Post Thumbnail"
                  className="w-full h-full object-cover"
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              </div>
              {/* Overlay Section: Profile & Icons */}
              <div className="p-4 flex items-center justify-between text-gray-400">
                <div className="flex items-center space-x-4">
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
                  <span
                    className="flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform duration-200 text-white"
                    onClick={() => toggleComments(post._id)}
                  >
                    <FaRegComment className="text-[#877EFF] text-xl" />
                    <span className="text-sm font-medium">{postComments.length}</span>
                  </span>
                </div>
                <span
                  className="cursor-pointer"
                  onClick={() => handleSavePost(post._id)}
                >
                  {savedPosts[post._id] ? (
                    <CiSaveDown2 className="text-xl text-yellow-500" />
                  ) : (
                    <CiSaveUp2 className="text-xl text-[#877EFF] hover:text-yellow-500" />
                  )}
                </span>
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
        })}
      </div>
    </div>
  );
};

export default UserPost;
