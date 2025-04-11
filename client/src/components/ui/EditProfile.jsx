import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearUpdateStatus,
  fetchProfile,
  updateProfile,
} from "../../features/auth/profileSlice";
import { toast, ToastContainer } from "../../toaster/Toaster";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Local state for the form and image preview
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });

  // Get profile state from Redux
  const {
    data: profile,
    loading,
    updating,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth.user);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("bio", form.bio);
    formData.append("name", form.name);
    if (image) {
      formData.append("image", image);
    }
    dispatch(updateProfile(formData));
  };

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile?.userId?.name || "",
        username: profile.username || "@new_user",
        email: profile?.userId?.email || "",
        bio: profile.bio || "",
      });
    } else {
      setForm({
        name: user?.user?.name || "",
        username: "",
        email: user?.user?.email || "",
        bio: "Updating my bio, one decade at a time.",
      });
    }
  }, [profile, user]);

  // Watch for update success or error to notify the user
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully! 🎉", {
        toastId: "updateSuccess",
      });
      dispatch(clearUpdateStatus());
      navigate("/profile", { state: { showProfileToast: true } });
    }
    if (updateError) {
      if (updateError.response?.data?.message === "Username already taken") {
        toast.error("Username is already taken. Please choose another.", {
          toastId: "usernameTaken",
        });
      } else {
        toast.error("Username is already taken. Please choose another.", { toastId: "updateError" });
      }
    }
  }, [updateSuccess, updateError, dispatch, navigate]);

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} closeOnClick />
    <div className="bg-black text-white w-full px-4 md:px-12 py-5">
      <h1 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 hidden md:flex">
        <FaRegEdit />
        Edit Profile
      </h1>
      <div className="flex flex-row items-center mb-6 gap-4">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={selectedImage || profile?.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2">
          <input type="file" id="fileInput" className="hidden" name="image" onChange={handleImageChange} />
          <label htmlFor="fileInput" className="text-indigo-500 text-sm cursor-pointer">
            Change profile photo
          </label>
        </div>
      </div>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 bg-[#1F1F22] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.name}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-2 bg-[#1F1F22] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.username}
            name="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email (Cannot be changed)
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 bg-[#1F1F22] border border-gray-700 rounded-lg cursor-not-allowed"
            value={form.email}
            name="email"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows="4"
            className="w-full p-2 bg-[#1F1F22] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.bio}
            name="bio"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-[#1F1F22] text-white rounded-lg cursor-pointer text-sm"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-pointer text-sm"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
    </>

  );
};

export default EditProfile;
