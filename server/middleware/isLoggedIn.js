const jwt = require("jsonwebtoken");
const userModel = require("../models/UserSchema");

module.exports = async function (req, res, next) {

    const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        let user = await userModel.findOne({ _id: decoded.id }).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Invalid token");
        return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
};
