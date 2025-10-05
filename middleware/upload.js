const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
         null,
         file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
   },
});

// File filter
const fileFilter = (req, file, cb) => {
   const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
   const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
   );
   const mimetype = allowedTypes.test(file.mimetype);

   if (mimetype && extname) {
      return cb(null, true);
   } else {
      cb(new Error("Only images and documents are allowed!"));
   }
};

// Configure multer
const upload = multer({
   storage: storage,
   limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
   },
   fileFilter: fileFilter,
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
   return (req, res, next) => {
      upload.single(fieldName)(req, res, (err) => {
         if (err) {
            return res.status(400).json({
               success: false,
               message: err.message,
            });
         }
         next();
      });
   };
};

// Middleware for multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => {
   return (req, res, next) => {
      upload.array(fieldName, maxCount)(req, res, (err) => {
         if (err) {
            return res.status(400).json({
               success: false,
               message: err.message,
            });
         }
         next();
      });
   };
};

module.exports = {
   upload,
   uploadSingle,
   uploadMultiple,
};
