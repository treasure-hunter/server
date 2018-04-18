const express = require('express');
const router = express.Router();
const { newRoom, updateRoom, deleteRoom} = require('../controllers/TreasureController.js')
const jwt = require('../middleware/jwt.js')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// path /treasure
router.post('/new/:uid',newRoom)
router.put('/update/:id', updateRoom)
router.delete('/delete/:id', deleteRoom)

module.exports = router;
