import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#09090A] text-white p-3 rounded-lg focus:outline-none focus:ring focus:ring-[#877EFF]"
                />
            </div>
        </div>
    );
}

export default SearchBar;
