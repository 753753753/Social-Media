const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as Buffer

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        console.log("Received File:", file); // Debugging
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images are allowed"), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
