const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,

});


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = ['jpg','jpeg', 'png', 'rar','zip']; // Add 'rar' to the allowed formats

    const fileFormat = file.originalname.split('.').pop().toLowerCase(); 
    if (allowedFormats.includes(fileFormat)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format'));
    }
  }
});

module.exports ={ upload,cloudinary};