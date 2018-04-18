const express = require('express');
const router = express.Router();
const { newRoom, updateTreasure, deleteTreasure} = require('../controllers/TreasureController.js')
const jwt = require('../middleware/jwt.js')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// path /treasure
router.post('/new',newRoom)

module.exports = router;
