const firebase = require('firebase')
const database = require('../firebase/index')
const admin = require('firebase-admin');

module.exports = {
  newRoom: (req, res) => {
    // create new room here
    // validation
    console.log(req.body);
    if (!req.body) {
      return res.status(400).json({
        message: 'no data sent'
      })
    } else if (!req.uid) {
      return res.status(400).json({
        message: 'no user id'
      })
    } else if (!req.body.roomName) {
      return res.status(400).json({
        message: 'no room name'
      })
    } else if (!req.body.latitude && !req.body.longitude) {
      return res.status(400).json({
        message: 'no geolocation'
      })
    } else if (!req.body.description) {
      return res.status(400).json({
        message: 'no description'
      })
    } else if (!req.body.hint) {
      return res.status(400).json({
        message: 'no hint'
      })
    }
    // console.log(req.body);
    let path
    if (!req.file) {
      path = 'N/A'
    } else {
      path = req.file.cloudUrl
    }
    console.log(path);
    const data = {
      roomName: req.body.roomName,
      description: req.body.description,
      hint: req.body.hint,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      image_path: path,
      isCompleted: false,
      uid: req.uid,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    }
    let newId = database.ref('Room').push(data)
    res.status(200).json({
      message: 'data sent to firebase',
      data,
      newId: newId.key
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
      admin.auth().getUser(req.uid)
        .then(userRecord => {
          let displayName
          if (userRecord.displayName === undefined) {
            displayName = 'Anonymous'
          } else {
            displayName = userRecord.displayName
          }
          // console.log(displayName);
          database.ref('Room').child(id).update(updates).then(() => {
            database.ref('Room').child(id).child('winner').child(req.uid).once('value')
              .then(snapshot => {
                // console.log(snapshot.val());
                if (snapshot.val() === null) {
                  database.ref('Room')
                    .child(id)
                    .child('winner')
                    .child(req.uid)
                    .set({
                      displayName: displayName,
                      uid: req.uid
                    }, (err) => {
                      if (err) {
                        res.status(500).json({
                          message: 'update error',
                          err
                        })
                      } else {
                        res.status(200).json({
                          message: 'Room sucessfully completed'
                        })
                      }
                    })
                } else {
                  res.status(403).json({
                    message: 'You cannot win twice!'
                  })
                }

              })
          }).catch(err => {
            res.status(500).json({
              message: 'something went wrong at firebase update',
              err
            })
          })
        }).catch(err => {
          res.status(500).json({
            message: 'something went wrong at firebase get user name',
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
