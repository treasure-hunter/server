const admin = require('firebase-admin');

function verifyToken (req, res, next) {
  let idToken = req.headers.token
  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    console.log('token', decodedToken);
    var uid = decodedToken.uid;
    req.body.uid = uid
    next()
  }).catch(function(error) {
    console.log('err', error);
    res.status(403).json({
      message: 'unauthorized',
      error
    })
  });
}


module.exports = {
  verifyToken
};
