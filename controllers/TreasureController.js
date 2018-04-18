const firebase = require('firebase')
const database = require('../firebase/index')

module.exports = {
  newRoom: (req, res) => {
    // create new room here
    // validation
    if (!req.body) {
      return res.status(400).json({
        message: 'no data sent'
      })
    } else if (!req.body.roomName) {
      return res.status(400).json({
        message: 'no room name'
      })
    } else if (!req.body.treasures) {
      return res.status(400).json({
        message: 'no treasures location data'
      })
    }
    console.log(req.body);
    const data = {
      roomName: req.body.roomName,
      description: req.body.description,
      treasures: req.body.treasures,
      isCompleted: false,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    }
    database.ref('Room').push(data)
    res.status(200).json({
      message: 'data sent to firebase',
      data
    })
  },
  updateRoom: (req, res) => {
    // if matching, update treasure as completed
    // if failed match, do not update treasure and send feedback

    // mock
    let match = true
    if (req.params.id.length > 30) {
      return res.status(400).json({
        message: 'ID too long'
      })
    }
    let id = req.params.id
    let updates = {
      isCompleted: true
    }
    if (match) {
      database.ref('Room').child(id).update(updates).then((something) => {
        console.log(something);
        res.status(200).json({
          message: 'Room sucessfully completed'
        })
      }).catch(err => {
        res.status(500).json({
          message: 'something went wrong at firebase update',
          err
        })
      })

    }
  },
  deleteRoom: (req, res) => {
    // too remove treasure data after finished
    if (req.params.id.length > 30) {
      return res.status(400).json({
        message: 'ID too long'
      })
    }
    let id = req.params.id
    database.ref('Room').child(id).remove()
    res.status(200).json({
      message: 'Room removed'
    })
  }

};
