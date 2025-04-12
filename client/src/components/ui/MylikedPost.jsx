import React, { useEffect, useState } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLikeData, toggleLike } from "../../features/auth/likeSlice";
import { fetchallPosts } from "../../features/auth/postSlice";
import { fetchSavedData, toggleSave } from "../../features/auth/saveSlice";

const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

function MylikedPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Fetch all posts from the posts slice.
  const { allPosts, loading: postsLoading } = useSelector((state) => state.posts);


  // Fetch posts on component mount.
  useEffect(() => {
    dispatch(fetchallPosts());
  }, [dispatch]);

  // Get like data from the likes slice.
  const { allLikedPosts, likedPosts, likeCounts, loading: likesLoading } =
    useSelector((state) => state.likes);

  // Get saved posts from Redux state.
  const savedPosts = useSelector((state) => state.saves.savedPosts);

  // When posts are loaded, fetch like data and saved posts.
  useEffect(() => {
    if (allPosts && allPosts.length > 0) {
      dispatch(fetchLikeData(allPosts));
    }
    dispatch(fetchSavedData());
  }, [dispatch, allPosts]);

  // Handle like toggle.
  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
    // Optionally, refetch posts if you want to refresh the state.
    dispatch(fetchallPosts());
  };

  // Handle save toggle.
  const handleSavePost = (postId) => {
    dispatch(toggleSave(postId));
  };

  // Once savedPostsArray is available, fetch like data and comments for each post.
  useEffect(() => {
    if (Array.isArray(allLikedPosts) && allLikedPosts.length > 0) {
      const posts = allLikedPosts.map((item) => item.postId);
      // Dispatch comments fetch for each saved post.
    }
  }, [dispatch, allLikedPosts]);

  if (postsLoading || likesLoading) {
    return (
      <div className="flex justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Filter out posts created by the logged-in user.

  if (allLikedPosts.length === 0) {
    return (
      <div className="flex justify-center h-screen">
        <p className="text-white text-xl">No liked posts found.</p>
      </div>
    );
  }



  return (
    <div className="w-full py-6 px-4 bg-black">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto items-start">
        {allLikedPosts.map((item) => {
          const post = item?.postId;
          const postId = post?._id;

          const isLiked = likedPosts[postId];
          const likeCount = likeCounts[postId] || 0;
          return (
            <div
              key={postId}
              className="bg-[#09090A] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-md flex flex-col"
            >
              <div
                className="h-[250px] sm:h-[300px] cursor-pointer"
                onClick={() => navigate(`/post/${postId}/user/${post.userId}`)}
              >
                <img
                  src={`data:image/png;base64,${post?.image}`}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>

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

                </div>

                <span onClick={() => handleSavePost(postId)} className="cursor-pointer">
                  {savedPosts[postId] ? (
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
}

export default MylikedPost;
