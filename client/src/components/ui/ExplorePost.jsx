import React, { useEffect } from "react";
import { CiHeart, CiSaveDown2, CiSaveUp2 } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchComments } from "../../features/auth/commentSlice";
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
  const { likedPosts, likeCounts } = useSelector((state) => state.likes);
  const savedPosts = useSelector((state) => state.saves.savedPosts);

  useEffect(() => {
    if (posts.length > 0) {
      dispatch(fetchLikeData(posts));
      posts.forEach((post) => dispatch(fetchComments(post._id)));
    }
  }, [dispatch, posts]);

  const handleLikePost = (postId) => {
    dispatch(toggleLike(postId));
  };

  const handleSavePost = (postId) => {
    dispatch(toggleSave(postId));
  };


  return (
    <div className="w-full py-6 px-4 bg-black">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto items-start">
      {posts.map((post) => {
        const postId = post._id;
        const isLiked = likedPosts[postId];
        const likeCount = likeCounts[postId] || 0;
        const isSaved = savedPosts[postId];

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
                {isSaved ? (
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

export default ExplorePost;
