// Initialize Firebase
const firebase = require('firebase')
const config = {
  apiKey: "AIzaSyBcuLoD388iMtThDVgw83xloalWRQX4v4s",
  authDomain: "treasure-hunter-1c288.firebaseapp.com",
  databaseURL: "https://treasure-hunter-1c288.firebaseio.com",
  projectId: "treasure-hunter-1c288",
};
const database = firebase.initializeApp(config).database();
module.exports = database;
