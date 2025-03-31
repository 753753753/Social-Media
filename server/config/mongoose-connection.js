require('dotenv').config(); // Add this at the top

const mongoose = require('mongoose');
const dbgr = require('debug')("development : mongoose");

mongoose.connect(process.env.Mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB Connected!");
    dbgr("Connected to MongoDB");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    dbgr(err);
});

module.exports = mongoose.connection;
