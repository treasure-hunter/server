const jwt = require('jsonwebtoken')

function getJWT (req, res, next) {
  // edit data from firebase auth
  const data = {
    name: req.body.name,
    email: req.body.email
  }
  console.log('giving jwt...');
  const token = jwt.sign(data, process.env.SECRETKEY)
  req.token = token;
  return next()
}

function authJWT (req, res, next) {
  console.log('authenticating');
  try {
    const decoded = jwt.verify(req.headers.token, process.env.SECRETKEY)
    req.decoded = decoded;
    return next()
  } catch (err) {
    res.status(401).send(err)
  }
}

module.exports = {
  getJWT: getJWT,
  authJWT: authJWT,
}
