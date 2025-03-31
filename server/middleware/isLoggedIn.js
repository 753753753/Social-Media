const jwt = require("jsonwebtoken");
const userModel = require("../models/UserSchema");

module.exports = async function (req, res, next) {
    console.log("enter on middleware")
    if (!req.cookies.token) {
        console.log("Unauthorized. Please log in.")
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            console.log("not found")
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        console.log("middle exit")
        next();
    } catch (error) {
        console.log("invaild")
        return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
};
