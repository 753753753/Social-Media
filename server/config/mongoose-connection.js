const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')("development : mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/socialmedia`)
.then(() => {
    console.log("MongoDB Connected!");  // Add this for visibility
    dbgr("Connected to MongoDB");
})
.catch(err => {
    console.log("MongoDB Connection Error:", err); // Add this for errors
    dbgr(err);
});

module.exports = mongoose.connection;
