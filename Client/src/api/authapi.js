
// Authentication
const BASE_URL = "http://192.168.29.21:3000"

export const registerUser = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ✅ Ensures cookies are included in requests
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error registering user:", error);
        return false; // Return false in case of an error
    }
};

export const loginUser = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ✅ Ensures cookies are included in requests
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error registering user:", error);
        return false; // Return false in case of an error
    }
};

export const islogged = async () => {
    try {
        await fetch(`${BASE_URL}/check-auth`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensures cookies are included in requests
        });
        const data = await response.json();
        return { ...data.user, ...data.profile };
    } catch (error) {
        console.error("Error registering user:", error);
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensures cookies are included in requests
        });
        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        console.error("Error registering user:", error);
    }
};

// Profile

export const updateprofile = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/updateprofile`, {
            method: 'POST',
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

// Post 
export const uploadpost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/post/uploadpost`, {
            method: 'POST',
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


// Savedpost
export const savedpost = async (formdata) => {
    try {
        const response = await fetch(`${BASE_URL}/saved`, {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
            headers: {
                "Content-Type": "application/json" // ✅ Important for JSON data
            },
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
            headers: {
                "Content-Type": "application/json" // ✅ Important for JSON data
            },
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
            headers: {
                "Content-Type": "application/json" // ✅ Important for JSON data
            },
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
            headers: {
                "Content-Type": "application/json" // ✅ Important for JSON data
            },
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