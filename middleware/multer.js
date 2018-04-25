const multer = require('multer')

let memStorage = multer.memoryStorage()

let memUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
})

module.exports = memUpload;
