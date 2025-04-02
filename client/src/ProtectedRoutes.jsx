import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
   const isAuthenticated = localStorage.getItem("token"); // Change this based on your auth logic

   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes
