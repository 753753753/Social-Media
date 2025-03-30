import React from 'react';
import { CiHeart } from "react-icons/ci";
import { MdInsertPhoto } from "react-icons/md";
function Buttons({ setActiveView, activeView }) {
    return (
        <div className="flex space-x-2 bg-black text-white py-8 px-18">
            <button
                className={`bg-[#09090A] text-white px-4 py-2 flex items-center gap-1 rounded ${activeView === "posts" ? "bg-indigo-500" : "bg-[#09090A]"}`}
                onClick={() => setActiveView("posts")}
            >
                <MdInsertPhoto />Posts
            </button>
            <button
                className={`bg-[#09090A] text-white px-4 py-2 flex items-center gap-1  rounded ${activeView === "liked" ? "bg-indigo-500" : "bg-[#09090A]"}`}
                onClick={() => setActiveView("liked")}
            >
                <CiHeart /> Liked Posts
            </button>
        </div>
    )
}

export default Buttons
