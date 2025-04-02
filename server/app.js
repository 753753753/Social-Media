const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const expressSession = require('express-session')

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://social-media-client-l4pk.onrender.com"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({ resave: false, saveUninitialized: false, secret: process.env.EXPRESS_SESSION_SECRET }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  console.log("Body:", req.body);
  next();
});

// Import Routes
const db = require("./config/mongoose-connection");
const commentroutes = require("./routes/comment")
const followroutes = require('./routes/follow')
const likeroutes = require('./routes/like')
const postroutes = require('./routes/post')
const savedroutes = require('./routes/saved')
const userroutes = require('./routes/user')

// Handling Routes
app.use('/follow', followroutes)
app.use('/like', likeroutes)
app.use('/saved', savedroutes)
app.use('/post', postroutes)
app.use('/comment', commentroutes)
app.use('/', userroutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
