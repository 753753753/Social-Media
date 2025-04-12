import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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

    }
  }, [dispatch, userPosts]);


  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
  };

  const handleSavePost = (postId) => {
    dispatch(toggleSave(postId));
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

            </div>

            <span onClick={() => handleSavePost(post._id)} className="cursor-pointer">
              {savedPosts[post._id] ? (
                <CiSaveDown2 className="text-yellow-500 text-xl" />
              ) : (
                <CiSaveUp2 className="text-[#877EFF] text-xl hover:text-yellow-500" />
              )}
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default UserPost;
