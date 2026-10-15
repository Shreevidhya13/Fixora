
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.join(__dirname, "..", "uploads");

// Create the uploads folder automatically.
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDirectory);
  },

  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeFilename = `${crypto.randomUUID()}${extension}`;
    callback(null, safeFilename);
  },
});

function fileFilter(req, file, callback) {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    return callback(null, true);
  }

  callback(
    new Error("Only PNG, JPEG, and WebP images are allowed.")
  );
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = upload;
