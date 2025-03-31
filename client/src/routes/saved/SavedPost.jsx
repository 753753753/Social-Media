import React from 'react';
import { CiSaveDown2 } from "react-icons/ci";
import AllsavedPost from '../../components/ui/AllsavedPost';
function SavedPost() {
   
    return (
        <div className='py-6 md:p-6 bg-black h-screen'>
            <div className="flex items-center gap-1 hidden md:block">
                <CiSaveDown2 className="text-white text-3xl" />
                <h1 className="text-3xl font-bold bg-black p-4 shadow-md inline-flex ">
                    Saved Posts
                </h1>
            </div>
            {/* Saved Post */}
            <AllsavedPost />
        </div>
    )
}

export default SavedPost
 