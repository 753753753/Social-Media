import React from 'react';
import { FaDotCircle } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
export default function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex flex-col justify-center items-center bg-[#000000] text-white p-8">
                <h1 className="text-2xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2 shadow-md">
                    <FaDotCircle className="text-purple-800" />
                    ApnaGram
                </h1>
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
            <div className="hidden lg:flex flex-1 items-center justify-center bg-black h-screen">
                <img src="../images/side-img.svg" alt="Post 1" className="h-full w-full object-cover rounded-lg" />
            </div>
        </div>

    )
}
