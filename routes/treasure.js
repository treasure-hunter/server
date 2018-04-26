const express = require('express');
const router = express.Router();
const { newRoom, updateRoom, deleteRoom} = require('../controllers/TreasureController.js')
const { verifyToken } = require('../middleware/firebaseAuth')
const memupload = require('../middleware/multer.js')
const checkUpload = require('../middleware/fileType.js')
const { googleUpload, googleDelete } = require('../middleware/googleCloudStorage.js')

// path /treasure
router.post('/new',verifyToken, function(req, res, next) {
  memupload.single('image')(req, res, next, /* istanbul ignore next */ function(err) {
    if (err) {
      console.log(err)
      next()
    } else {
      console.log('no multer error');
      next()
    }
  })
}, checkUpload, googleUpload, newRoom)
router.put('/update/:id', verifyToken, updateRoom)
router.delete('/delete/:id', verifyToken, googleDelete, deleteRoom)

module.exports = router;
