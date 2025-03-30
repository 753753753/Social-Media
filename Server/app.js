// Required
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session')

// Middle Ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://192.168.29.21:5173", // Allow frontend on mobile
  credentials: true,
}));
app.use(cookieParser());
app.use(expressSession({ resave: false, saveUninitialized: false, secret: process.env.EXPRESS_SESSION_SECRET }))

// Import Routes
const db = require("./config/mongoose-connection");
const commentroutes = require("./routes/comment")
const followroutes = require('./routes/follow')
const likeroutes = require('./routes/like')
const postroutes = require('./routes/post')
const savedroutes = require('./routes/saved')
const userroutes = require('./routes/user')

// Handling Routes
app.use('/', userroutes)
app.use('/follow', followroutes)
app.use('/like', likeroutes)
app.use('/saved', savedroutes)
app.use('/post', postroutes)
app.use('/comment', commentroutes)

const PORT = 3000;
const HOST = '0.0.0.0'; // Allows external devices to connect

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
