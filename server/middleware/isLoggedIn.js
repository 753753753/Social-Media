const jwt = require("jsonwebtoken");
const userModel = require("../models/UserSchema");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
};
