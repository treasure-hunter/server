const Storage = require('@google-cloud/storage');
const firebase = require('firebase')
const database = require('../firebase/index')

const config = {
  CLOUD_BUCKET: 'treasure.teddydevstack.com',
  PROJECT_ID: 'fancy-to-do'
}

// confirm service api
const storage = Storage({
  projectId: config.PROJECT_ID,
  keyFilename: 'treasure_hunter_admin.json'
});

function storageUrl (filename) {
  return `https://storage.googleapis.com/${config.CLOUD_BUCKET}/${filename}`;
}

// middleware
function googleUpload (req, res, next) {
  console.log('===== gcs checking file... =====');

  if (!req.file) {
    console.log('no file uploaded, skipping...');
    return next();
  }
  console.log(req.file);
  
  const bucket = storage.bucket(config.CLOUD_BUCKET)

  let extension = req.file.originalname.split('.').pop()
  const destination = 'quest/'
  const uploadName = destination + Date.now() + `-${req.uid}-` + 'quest.' + extension;
  const file = bucket.file(uploadName);

  // streaming
  const stream = file.createWriteStream({
    metadata: {
      contentType : req.file.mimetype
    }
  });

  stream.on('error', /* istanbul ignore next */ (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = uploadName;
    file.makePublic()
      .then(() => {
        console.log('upload finished');
        req.file.cloudUrl = storageUrl(uploadName);
        next();
      });
  });

  stream.end(req.file.buffer);
}

// function googleUploadWinner (req, res, next) {
//   console.log('===== gcs checking file... =====');
//   console.log(req.file);
//   if (!req.file) {
//     console.log('no file uploaded, skipping...');
//     return next();
//   }
//   const bucket = storage.bucket(config.CLOUD_BUCKET)
//
//   let extension = req.file.originalname.split('.').pop()
//   const destination = 'winner/'
//   const uploadName = destination + Date.now() + `-${req.uid}-` + 'quest.' + extension;
//   const file = bucket.file(uploadName);
//
//   // streaming
//   const stream = file.createWriteStream({
//     metadata: {
//       contentType : req.file.mimetype
//     }
//   });
//
//   stream.on('error', (err) => {
//     req.file.cloudStorageError = err;
//     next(err);
//   });
//
//   stream.on('finish', () => {
//     req.file.cloudStorageObject = uploadName;
//     file.makePublic()
//       .then(() => {
//         console.log('upload finished');
//         req.file.cloudUrl = storageUrl(uploadName);
//         next();
//       });
//   });
//
//   stream.end(req.file.buffer);
// }

function googleDelete (req, res, next) {
  console.log('checking data...');
  let id = req.params.id
  let path

    database.ref('Room').child(id).once('value')
    .then(snapshot => {
      if (snapshot.val().uid === req.uid) {
        path = snapshot.val().image_path
        if (path === 'N/A') {
          console.log('No image to delete');
          return next()
        }
        console.log('Path', path);

        console.log('deleting..');
        let extra = 'https://storage.googleapis.com/treasure.teddydevstack.com/';
        const targetFile = path.substr(extra.length);
        console.log(targetFile);

        storage
          .bucket(config.CLOUD_BUCKET)
          .file(targetFile)
          .delete()
          .then(() => {
            console.log(`${config.CLOUD_BUCKET}/${targetFile} is deleted`);
            next()
          })
          .catch(err => /* istanbul ignore next */ {
            res.status(500).json({
              message: 'failed to delete image',
              err
            })
          })
      } else {
        /* istanbul ignore next */
        res.status(403).json({
          message: 'Unauthorized to delete'
        })
      }


    })
    .catch(e => /* istanbul ignore next */ {
      console.log(e);
      next(e)
    })


}

module.exports = {
  googleUpload: googleUpload,
  googleDelete: googleDelete,
  // googleUploadWinner: googleUploadWinner
};
