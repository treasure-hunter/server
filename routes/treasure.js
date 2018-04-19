const express = require('express');
const router = express.Router();
const { newRoom, updateRoom, deleteRoom} = require('../controllers/TreasureController.js')
const { verifyToken } = require('../middleware/firebaseAuth')
// const jwt = require('../middleware/jwt.js')

// path /treasure
router.post('/new',verifyToken, newRoom)
router.put('/update/:id', updateRoom)
router.delete('/delete/:id', deleteRoom)

module.exports = router;
