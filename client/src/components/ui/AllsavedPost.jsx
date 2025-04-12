// src/components/AllsavedPost.jsx
import React, { useEffect } from 'react';
import { CiHeart, CiSaveDown2 } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

  const hasFetchedsavedpost = useSelector((state) => state.saves.hasFetchedsavedpost);

  // Initially fetch saved posts.

  useEffect(() => {
    if(!hasFetchedsavedpost){
      dispatch(fetchSavedData());
    }
  }, [dispatch]);

  // Once savedPostsArray is available, fetch like data and comments for each post.
  useEffect(() => {
    if (Array.isArray(savedPostsArray) && savedPostsArray.length > 0) {
      const posts = savedPostsArray.map((item) => item.postId);
      // Dispatch like data for all saved posts.
      dispatch(fetchLikeData(posts));
      // Dispatch comments fetch for each saved post.
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
        return (
          <div
            key={postId}
            className="bg-[#09090A] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-md flex flex-col"
          >
            {/* Post Image */}
            <div
              className="h-[250px] sm:h-[300px] cursor-pointer"
              onClick={() => navigate(`/post/${postId}/user/${post.userId}`)}
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

              </div>

              <span onClick={() => handleSavePost(postId)} className="cursor-pointer">
                <CiSaveDown2 className="text-yellow-500 text-xl hover:text-yellow-400" />
              </span>
            </div>
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
