const fileType = require('file-type')

function checkUpload (req, res, next) {
  if (!req.file) {
    return next()
  } else if (req.file.buffer) {
    const fileInfo = fileType(req.file.buffer)
    console.log('===file-type check=== ', fileInfo)
    if (!fileInfo) {
      // req.file = null
      console.log('file-type cannot recognize buffer');
      return next()
    } else {
      /* istanbul ignore else  */
      if (fileInfo.mime === 'image/png' || fileInfo.mime === 'image/gif' || fileInfo.mime === 'image/jpeg') {
        return next()
      } else {
        // req.file = null
        console.log('magic number mime mismatch!');
        return next()
      }
    }
  }
}

module.exports = checkUpload;
