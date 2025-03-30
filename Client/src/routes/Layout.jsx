import React, { useEffect } from "react";
import { FaCompass, FaDotCircle, FaHome, FaPlusCircle, FaSave, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { performLogout } from "../features/auth/authSlice";
import { fetchProfile } from '../features/auth/profileSlice';
import Sidebar from "./Sidebar";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data: profile, loading: profileLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(performLogout());
    if (performLogout.fulfilled.match(resultAction)) {
      navigate("/login", { state: { showLogoutToast: true } });
    }
  };

  return (
    <>
      <div className="flex min-h-screen overflow-hidden hidden sm:block ">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-[#09090A] transition-transform transform">
          <Sidebar user={user?.user} profile={profile} />
        </div>

        {/* Main Content */}
        <div className="flex-1 sm:ml-64 p-6 h-screen overflow-y-auto bg-black text-white">
          <Outlet />
        </div>
      </div>

      <div className="flex h-screen bg-black text-white md:hidden pb-16">
        {/* Main Content Area */}
        <div className="flex-1 md:ml-64 pt-16 pb-16 overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden fixed top-0 left-0 w-full bg-[#09090A] flex items-center justify-between px-4 py-3 border-b border-gray-700 shadow-sm">
            {/* Logo / App Name */}
            <div className="flex items-center gap-2">
              <FaDotCircle className="text-[#5D5FEF] text-2xl" />
              <h1 className="text-xl font-bold">ApnaGram</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Search Icon */}
              <NavLink
                to="/people"
                className={({ isActive }) =>
                  `flex items-center text-2xl transition-colors duration-200 ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"
                  }`
                }
              >
                <FaSearch className="test-xl" />
              </NavLink>
              {/* Logout Button */}
              <button onClick={handleLogout} className="flex items-center text-xl text-[#5D5FEF] hover:text-white transition-colors duration-200">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
          <div className="w-full p-0 m-0">
            <Outlet />
          </div>
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#09090A] border-t border-gray-700 flex justify-around py-3">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"}`
              }
            >
              <FaHome className="text-2xl" />
              <span className="text-xs">Home</span>
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"}`
              }
            >
              <FaCompass className="text-2xl" />
              <span className="text-xs">Explore</span>
            </NavLink>

            <NavLink
              to="/create-post"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"}`
              }
            >
              <FaPlusCircle className="text-2xl" />
              <span className="text-xs">Post</span>
            </NavLink>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"}`
              }
            >
              <FaSave className="text-2xl" />
              <span className="text-xs">Saved</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-[#877EFF] font-bold" : "text-gray-400 hover:text-[#877EFF]"}`
              }
            >
              {profile?.profilePicture ? (
                <img
                  src={profile?.profilePicture}
                  alt={profile?.username || "User"}
                  className="w-7 h-7 rounded-2xl object-cover"
                />
              ) : (
                <span className="text-xs">
                  {profile?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              <span className="text-xs">Profile</span>
            </NavLink>
          </div>

        </div>
      </div>
    </>
  );
};

export default Layout;
