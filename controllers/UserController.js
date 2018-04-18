// const firebase = require('firebase')
// const database = require('../firebase/index')
//
// module.exports = {
//   addUser: (req, res) => {
//     const data = {
//       username: req.body.username,
//       email: req.body.email
//     }
//     let userId = database.ref('User').push(data)
//     res.status(200).json({
//       message: 'data sent to firebase',
//       data,
//       newId: newId.key
//     })
//   },
//   editUser: (req, res) => {
//
//   },
//   deleteUser: (req, res) => {
//
//   }
//
// };
