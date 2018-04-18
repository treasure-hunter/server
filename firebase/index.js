// admin
const admin = require('firebase-admin');

const serviceAccount = require('../firebase-admin-secret.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://treasure-hunter-1c288.firebaseio.com'
});

const database = admin.database();

module.exports = database;
