import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserThunk } from '../../features/auth/authSlice';
import { ToastContainer, toast } from '../../toaster/Toaster';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUserThunk(form));
    if (registerUserThunk.fulfilled.match(resultAction)) {
      navigate('/home', { state: { showRegisterToast: true } });
    } else {
      toast.error("Registration failed! Email may already be in use.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={4000} />
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Register;
