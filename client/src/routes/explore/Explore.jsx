import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ExplorePost from '../../components/ui/ExplorePost';
import SearchBar from '../../components/ui/SearchBar';
import { fetchallPosts } from '../../features/auth/postSlice';

function Explore() {
    const userPosts = useSelector((state) => state.posts.allPosts);
    const hasFetchedAllPosts = useSelector((state) => state.posts.hasFetchedAllPosts);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        if (!hasFetchedAllPosts) {
            dispatch(fetchallPosts());
        }
    }, [dispatch, hasFetchedAllPosts]);

    // Filter posts based on the search query (username)
    const filteredPosts = userPosts.filter((post) =>
        post.userProfile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-6 md:p-6 bg-black text-white h-screen">
            <h1 className="text-3xl font-bold mb-4 bg-black p-4 shadow-md hidden md:block">Search Posts</h1>

            {/* Search Bar */}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Popular Today Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 px-2 md:px-0">Popular Today</h2>
                <ExplorePost posts={filteredPosts} />
            </div>
        </div>
    );
}

export default Explore;
