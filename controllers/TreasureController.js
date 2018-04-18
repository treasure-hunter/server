const firebase = require('firebase')
// Initialize Firebase
// const config = {
//   apiKey: "AIzaSyBcuLoD388iMtThDVgw83xloalWRQX4v4s",
//   authDomain: "treasure-hunter-1c288.firebaseapp.com",
//   databaseURL: "https://treasure-hunter-1c288.firebaseio.com",
//   projectId: "treasure-hunter-1c288",
// };
// firebase.initializeApp(config);
// const database = firebase.database()

const database = require('../firebase/index')

module.exports = {
  newRoom: (req, res) => {
    // create new room here
    // validation
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
  updateTreasure: (req, res) => {
    // if matching, update treasure as completed
    // if failed match, do not update treasure and send feedback
  },
  deleteTreasure: (req, res) => {
    // too remove treasure data after finished
  }

};
