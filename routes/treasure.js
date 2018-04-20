const express = require('express');
const router = express.Router();
const { newRoom, updateRoom, deleteRoom} = require('../controllers/TreasureController.js')
const { verifyToken } = require('../middleware/firebaseAuth')
const memupload = require('../middleware/multer.js')
const { googleUpload, googleDelete } = require('../middleware/googleCloudStorage.js')

// path /treasure
router.post('/new',verifyToken, memupload.single('treasure'), googleUpload, newRoom)
router.put('/update/:id', verifyToken, updateRoom)
router.delete('/delete/:id', verifyToken, googleDelete, deleteRoom)

module.exports = router;
