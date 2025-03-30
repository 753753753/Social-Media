import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
    const { user, loading } = useSelector((state) => state.auth);
    // console.log(user)
    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes
