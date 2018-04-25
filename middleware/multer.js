const multer = require('multer')

let memStorage = multer.memoryStorage()

let memUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    // check for file extension
    console.log(file);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg')
    {
      console.log('====Image Accepted====');
      return cb(null, true);
    } else {
      console.log('====Image Rejected====');
      return cb(null, false);
    }
  }
})

module.exports = memUpload;
