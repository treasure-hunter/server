const admin = require('firebase-admin');

function verifyToken (req, res, next) {
  let idToken = req.headers.token
  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    req.uid = uid
    console.log('===token decoded===');
    next()
  }).catch(function(error) /* istanbul ignore next */ {
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
