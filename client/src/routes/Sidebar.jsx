// src/components/Sidebar.jsx
import React from 'react';
import { FaCompass, FaDotCircle, FaHome, FaPlusCircle, FaSave, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { performLogout } from '../features/auth/authSlice';

const Sidebar = ({user , profile}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(performLogout());
    if (performLogout.fulfilled.match(resultAction)) {
      navigate('/login', { state: { showLogoutToast: true } });
    }
  };

  return (
    <div className="text-white h-screen w-64 flex flex-col p-4">
      {/* Top Section - Logo, Profile, Logout */}
      <div>
        {/* Logo */}
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaDotCircle className="text-[#5D5FEF]" />
          ApnaGram
        </h1>

        {/* Profile */}
        <NavLink to="/profile" onClick>
          <div className="flex items-center mb-6 space-x-1.5">
            <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
              {profile?.profilePicture ? (
                <img
                  src={profile?.profilePicture}
                  alt={profile?.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl md:text-2xl font-bold">
                  {profile?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold">{profile?.userId?.name || user?.name}</h2>
              <p className="text-gray-400 text-xs">{profile?.username || "@newuser"}</p>
            </div>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation Links */}
      <div className="flex flex-col flex-grow mt-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mb-3 ${isActive ? 'bg-[#877EFF]' : ''
            }`
          }
          onClick
        >
          <FaHome /> Home
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mb-3 ${isActive ? 'bg-[#877EFF]' : ''
            }`
          }
          onClick
        >
          <FaCompass /> Explore
        </NavLink>
        <NavLink
          to="/people"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mb-3 ${isActive ? 'bg-[#877EFF]' : ''
            }`
          }
          onClick
        >
          <FaUser /> People
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mb-3 ${isActive ? 'bg-[#877EFF]' : ''
            }`
          }
          onClick
        >
          <FaSave /> Saved
        </NavLink>
        <NavLink
          to="/create-post"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mb-3 ${isActive ? 'bg-[#877EFF]' : ''
            }`
          }
          onClick
        >
          <FaPlusCircle /> Create Post
        </NavLink>
      </div>

      {/* Logout Button */}
      <NavLink className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </NavLink>
    </div>
  );
};

export default Sidebar;
