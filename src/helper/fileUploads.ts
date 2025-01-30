import multer from "multer";

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

console.log("=uploading=", uploads);

export const FileUploads = {
  uploads,
};
