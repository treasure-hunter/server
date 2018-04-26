const firebase = require('firebase')
const database = require('../firebase/index')
const admin = require('firebase-admin');

module.exports = {
  newRoom: (req, res) => {
    // create new room here
    // validation
    console.log(req.body);
    if (!req.body) {
      /* istanbul ignore next */
      return res.status(400).json({
        message: 'no data sent'
      })
    } else if (!req.uid) {
      /* istanbul ignore next */
      return res.status(400).json({
        message: 'no user id'
      })
    } else if (!req.body.roomName || typeof req.body.roomName !== 'string' || req.body.roomName.length > 100) {
      return res.status(400).json({
        message: 'no room name'
      })
    } else if (!req.body.latitude || typeof Number(req.body.latitude) !== 'number' || Number(req.body.latitude) === NaN) {
      return res.status(400).json({
        message: 'no geolocation'
      })
    } else if (!req.body.longitude || typeof Number(req.body.longitude) !== 'number' || Number(req.body.longitude) === NaN) {
      return res.status(400).json({
        message: 'no geolocation'
      })
    } else if (!req.body.description || typeof req.body.description !== 'string' || req.body.description.length > 150) {
      return res.status(400).json({
        message: 'no description'
      })
    } else if (!req.body.hint || typeof req.body.hint !== 'string'|| req.body.hint.length > 100) {
      return res.status(400).json({
        message: 'no hint'
      })
    }
    // console.log(req.body);
    let path
    if (!req.file) {
      console.log('===file not available===');
      path = 'N/A'
    } else {
      path = req.file.cloudUrl
    }
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
    /* istanbul ignore if */
    if (req.params.id.length > 30 || req.params.id == undefined) {
      return res.status(400).json({
        message: 'ID invalid'
      })
    } else if (req.body) {
      if (Object.keys(req.body).length !== 0) {
        return res.status(400).json({
          message: 'No data should be submitted'
        })
      }
    }
    let id = req.params.id
    let updates = {
      isCompleted: true
    }
    // verify update location has actual data
    database.ref('Room').child(id).once('value')
      .then(snapshot => {
        console.log(snapshot.val());
        if (snapshot.val() === null) {
          res.status(400).json({
            message: 'Invalid room'
          })
        } else {
          /* istanbul ignore else */
          if (match) {
            admin.auth().getUser(req.uid)
              .then(userRecord => {
                let displayName
                /* istanbul ignore else */
                if (userRecord.displayName === undefined) {
                  displayName = 'Anonymous'
                } else {
                  displayName = userRecord.displayName
                }
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
                              /* istanbul ignore next */
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
                        /* istanbul ignore next */
                        res.status(403).json({
                          message: 'You cannot win twice!'
                        })
                      }
                    })
                })
                .catch(err => /* istanbul ignore next */ {
                  res.status(500).json({
                    message: 'something went wrong at firebase update',
                    err
                  })
                })
              })
              .catch(err => /* istanbul ignore next */ {
                res.status(500).json({
                  message: 'something went wrong at firebase get user name',
                  err
                })
              })
          }
        }
      })
  },
  deleteRoom: (req, res) => {
    // too remove treasure data after finished
    /* istanbul ignore if */
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
