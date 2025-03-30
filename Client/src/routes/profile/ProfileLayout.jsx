import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Buttons from '../../components/shared/Buttons';
import ProfileDetail from '../../components/shared/ProfileDetail';
import MyPost from '../../components/ui/MyPost';
import MylikedPost from '../../components/ui/MylikedPost';
import { fetchProfile } from '../../features/auth/authSlice';

function ProfileLayout() {
    const [activeView, setActiveView] = useState("posts");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(fetchProfile());
        }
    }, [dispatch, user]);

    return (
        <div className="flex flex-col bg-black text-white h-full text-xs sm:text-sm md:text-xl">
            <ProfileDetail user={user?.user} />

            <div className="flex justify-between items-center md:p-4">
                <Buttons setActiveView={setActiveView} activeView={activeView} />
            </div>

            <div className="flex-grow md:p-4">
                {/* Ensure content scales appropriately */}
                {activeView === "posts" && <MyPost />}
                {activeView === "liked" && <MylikedPost />}
            </div>
        </div>

    )
}

export default ProfileLayout;
