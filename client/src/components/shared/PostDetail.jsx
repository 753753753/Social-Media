import React from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import PostContent from "../ui/PostContent";
import RealtedPost from "../ui/RealtedPost";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="px-2 md:p-6 bg-[#000000] min-h-screen text-white">
            <button
                className="text-[#877EFF] mb-6 cursor-pointer flex items-center gap-x-2"
                onClick={() => navigate(-1)}
            >
                <IoReturnUpBack />
                <span>Back</span>
            </button>

            {/* Post Content */}
            <div className="max-w-3xl mx-auto">
                <PostContent />
            </div>

            <hr className="my-6 border border-[#101012]" />

            {/* More Related Posts */}
            <RealtedPost />
        </div>
    );
};

export default PostDetail;
