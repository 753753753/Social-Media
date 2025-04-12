// src/components/CreatePost.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, fetchallPosts } from "../../features/auth/postSlice";
import { toast } from '../../toaster/Toaster';

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ caption: "", location: "" });
  const [image, setImage] = useState(null);

  // Access upload state if you need to show a spinner or disable the submit button
  const { uploading } = useSelector((state) => state.posts);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store file separately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", form.caption);
    formData.append("location", form.location);
    if (image) {
      formData.append("picture", image);
    }
    // Dispatch the createPost thunk
    const resultAction = await dispatch(createPost(formData));
    if (createPost.fulfilled.match(resultAction)) {
      dispatch(fetchallPosts())
      navigate('/home', { state: { showpostToast: true } });
    } else {
      toast.error("Error uploading post..!!");
    }
  };

  return (
    <div className="bg-black text-white w-full px-4 sm:px-6 py-5">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm sm:text-base font-medium mb-2">Caption</label>
        <textarea
          className="w-full p-3 bg-[#1F1F22] border border-gray-700 rounded-md mb-4 text-sm sm:text-base"
          placeholder="Write a caption..."
          name="caption"
          onChange={handleChange}
          value={form.caption}
        />

        <label className="block text-sm sm:text-base font-medium mb-2">Location</label>
        <input
          className="w-full p-3 bg-[#1F1F22] border border-gray-700 rounded-md mb-4 text-sm sm:text-base"
          placeholder="Add a location..."
          name="location"
          onChange={handleChange}
          value={form.location}
        />

        <label className="block text-sm sm:text-base font-medium mb-2">Add Photos</label>
        <input type="file" onChange={handleImageChange} name="image" className="mb-4" />

        <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-[#1F1F22] text-white rounded-md cursor-pointer"
            onClick={() => navigate('/home')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-md cursor-pointer"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>

  );
};

export default CreatePost;
