// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://social-media-server-s0tb.onrender.com"; 

// Save token in localStorage
const saveToken = (token) => {
    localStorage.setItem("authToken", token);
};

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem("authToken");
};

// Helper function to get headers with token
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

// Authentication
export const registerUser = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');

        saveToken(data.token);
        return data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const loginUser = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        saveToken(data.token);
        return data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Logout failed");
        localStorage.removeItem("authToken");
        return data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
};

export const fetchProfileAPI = async () => {
    try {
        const response = await fetch(`${BASE_URL}/check-auth`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch profile");
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// Profile

export const updateprofile = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/updateprofile`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
    }
};

export const getprofile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/getprofile`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/getuserprofile/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch other user posts");
        return await response.json();
    } catch (error) {
        console.error("Error fetching other user posts:", error);
        return { error: error.message };
    }
};

// Post 
export const uploadpost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/post/uploadpost`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included in requests
            body: formdata, // ✅ Send FormData directly
        });
        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error uploading post:", error);
    }
};

export const getpost = async () => {
    try {
        const response = await fetch(`${BASE_URL}/post/getpost`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

export const getuserpost = async () => {
    try {
        const response = await fetch(`${BASE_URL}/getposts`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { error: error.message };
    }
};

export const getPostDetail = async (postId) => {
    try {
        const response = await fetch(`${BASE_URL}/post/getpostdetail/${postId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch post detail");
        return await response.json();
    } catch (error) {
        console.error("Error fetching post detail:", error);
        return { error: error.message };
    }
};

export const getOtherUserPosts = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/getuserposts/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch other user posts");
        return await response.json();
    } catch (error) {
        console.error("Error fetching other user posts:", error);
        return { error: error.message };
    }
};


// Savedpost
export const savedpost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/saved`, {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
            headers: getAuthHeaders(),
            body: JSON.stringify(formdata), // ✅ Convert object to JSON string
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error saving post:", error);
    }
};

export const getsavedpost = async () => {
    try {
        const response = await fetch(`${BASE_URL}/saved/getsavedpost`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

// Allusers
export const getallprofile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/getallprofile`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

// Likepost
export const likepost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/like`, {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
            headers: getAuthHeaders(),
            body: JSON.stringify(formdata), // ✅ Convert object to JSON string
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error saving post:", error);
    }
};

export const getlikepost = async () => {
    try {
        const response = await fetch(`${BASE_URL}/like/getlikepost`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

export const getlikecount = async () => {
    try {
        const response = await fetch(`${BASE_URL}/like/getlikecount`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

// comment 

export const addcomment = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/comment`, {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
            headers: getAuthHeaders(),
            body: JSON.stringify(formdata), // ✅ Convert object to JSON string
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error saving post:", error);
    }
};

export const getcomment = async (postId) => {
    try {
        const response = await fetch(`${BASE_URL}/comment/getcomment/${postId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

// follow 
export const followpost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/follow`, {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
            headers: getAuthHeaders(),
            body: JSON.stringify(formdata), // ✅ Convert object to JSON string
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error saving post:", error);
    }
};

export const getFollowStats = async () => {
    try {
        const response = await fetch(`${BASE_URL}/follow/followStats`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};

export const userfollowStats = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/follow/userfollowStats/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include', // Ensures cookies are included
        });

        // Ensure response is OK before parsing JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return API response
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message }; // Return error for handling
    }
};