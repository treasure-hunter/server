'use strict'

const fs = require('fs');

const dotEnvVerify = fs.existsSync('treasure_hunter_admin.json')
if (dotEnvVerify) {
  console.log('Creds exist');
  process.exit();
}

const storage = require('@google-cloud/storage')()

const bucketName = `dotenv.fancy-to-do.teddydevstack.com`
console.log(`Downloading Creds from bucket "${bucketName}"`)
storage
  .bucket(bucketName)
  .file('treasure_hunter_admin.json')
  .download({ destination: 'treasure_hunter_admin.json' })
  .then(() => {
    console.info('Creds downloaded')
  })
  .catch(err => {
    console.log(err);
  })
