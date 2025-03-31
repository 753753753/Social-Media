import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../../features/auth/authSlice';
import { toast, ToastContainer } from '../../toaster/Toaster';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUserThunk(form));
    if (loginUserThunk.fulfilled.match(resultAction)) {
      navigate('/home', { state: { showLoginToast: true } });
    } else {
      toast.error("Login failed! Check your credentials.");
    }
  };

  const location = useLocation();
  useEffect(() => {
    if (location.state?.showLogoutToast) {
      toast.success("Logout successful! 🎉");
    }
  }, [location.state]);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Log in to your account</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
