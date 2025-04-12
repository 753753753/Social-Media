import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchotherPosts } from "../../features/auth/postSlice";

const RealtedPost = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userPosts, loading, error } = useSelector((state) => state.posts);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchotherPosts(userId));
    }
  }, [dispatch, userId]);

  const handleNext = () => {
    if (activeIndex !== null && userPosts.length > 0) {
      setActiveIndex((activeIndex + 1) % userPosts.length);
    }
  };

  const handlePrev = () => {
    if (activeIndex !== null && userPosts.length > 0) {
      setActiveIndex((activeIndex - 1 + userPosts.length) % userPosts.length);
    }
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="w-full p-4 bg-black relative">
      <h1 className='text-lg font-bold text-white mb-4'>More Related Posts</h1>
      <div className="flex flex-wrap gap-4">
        {userPosts && userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <div
              key={post._id}
              className="w-[120px] h-[120px] rounded-md overflow-hidden cursor-pointer border border-[#2c2c2c]"
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={post.image}
                alt="Related Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))
        ) : (
          <p className="text-white">No related posts found.</p>
        )}
      </div>

      {/* Click Preview */}
      {activeIndex !== null && userPosts[activeIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-[90vw] max-w-[500px] h-[90vw] max-h-[500px] rounded-lg overflow-hidden border border-gray-600 shadow-xl">
            <img
              src={userPosts[activeIndex].image}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-black bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 z-10"
            >
              <FaTimes />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-60 p-2 rounded-full text-white hover:bg-opacity-80"
            >
              <FaChevronLeft />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-60 p-2 rounded-full text-white hover:bg-opacity-80"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtedPost;
