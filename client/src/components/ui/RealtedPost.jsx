import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchotherPosts } from "../../features/auth/postSlice";

const RealtedPost = () => {
  const { userId } = useParams(); // Make sure this matches your route
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (userId) {
      dispatch(fetchotherPosts(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4 bg-black">
      <h1 className='text-lg font-bold text-white mb-4'>More Related Posts</h1>
      <div className="flex flex-wrap gap-4">
        {userPosts && userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div
              key={post._id}
              className="w-[120px] h-[120px] rounded-md overflow-hidden cursor-pointer border border-[#2c2c2c]"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <img
                src={post.image}
                alt="Related Post"
                className="w-full h-full object-cover hover:scale-105 transition duration-200"
              />
            </div>
          ))
        ) : (
          <p className="text-white">No related posts found.</p>
        )}
      </div>
    </div>
  );
};

export default RealtedPost;
