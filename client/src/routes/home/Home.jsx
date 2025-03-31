import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../../components/shared/PostCard";
import TopCreator from "../../components/shared/TopCreator";
import { toast, ToastContainer } from "../../toaster/Toaster";

const Home = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.success("Login successful! 🎉");
    }
    if (location.state?.showRegisterToast) {
      toast.success("Registration successful! 🎉");
    }
    if (location.state?.showpostToast) {
      toast.success("Post Created! 🎉");
    }
    if (location.state?.showprofileToast) {
      toast.success("Edit successful! 🎉");
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Main Feed Section */}
        <div className="md:col-span-3 h-screen py-4 md:p-4">
          <h1 className="text-3xl font-bold mb-8 bg-black p-4 shadow-md cursor-pointer hidden md:block">
            Home Feed
          </h1>
          <PostCard />
        </div>

        {/* Hide TopCreator on mobile, show only on md+ screens */}
        <div className="hidden xl:block">
          <TopCreator />
        </div>
      </div>
    </>
  );
};

export default Home;
