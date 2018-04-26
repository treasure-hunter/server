const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { testUID, password, email, config } = require('./testUID.js')
const app = require('../app');
const admin = require('firebase-admin');
const firebase = require('firebase');
const fs = require('fs')
const path = require('path')

firebase.initializeApp(config);
chai.use(chaiHttp)

let testID;
let token = null;


describe('server api should execute with no errors', () => {
  it('should access app without any problem', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done()
    })
  })
  it('should login with test account and get token', (done) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
          .then(resp => {
            token = resp
            console.log(token);
            expect(token).to.not.be.null
            done()
          })
          .catch(err => {
            console.log(err);
            expect(err).to.be.null
          })
      })
      .catch(err => {
        console.log(err);
        expect(err).to.be.null
      })
  })
  it('adding new room data with proper data should work, no upload', (done) => {
    let testData = {
      roomName: 'chaiTesting',
      description: 'chaiDesc',
      hint: 'chaiTreasures',
      longitude: 123,
      latitude: 123,
    }
    let uid = 'TESTUID123'
    console.log('hello?');
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      console.log(res.error);
      console.log(err);
      console.log(res);
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.data.roomName).to.equal(testData.roomName)
      expect(res.body.data.description).to.equal(testData.description)
      testID = res.body.newId
      done()
    })
  }).timeout(9000)
  it('should update data', (done) => {
    chai.request(app)
    .put(`/treasure/update/${testID}`)
    .set('token', token)
    .send({})
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.message).to.equal('Room sucessfully completed')
      done()
    })
  }).timeout(4000)

  it('should delete data', (done) => {
    chai.request(app)
    .delete(`/treasure/delete/${testID}`)
    .set('token', token)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.message).to.equal('Room removed')
      done()
    })
  })
})


describe('testing mishandled input and brute force', () => {
  it('Quest room creation should handle: no roomName', (done) => {
    let testData = {
      description: 'chaiDesc',
      hint: 'chaiTreasures',
      longitude: 123,
      latitude: 123,
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no room name')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('Quest room creation should handle: no description', (done) => {
    let testData = {
      roomName: 'test room',
      hint: 'chaiTreasures',
      longitude: 123,
      latitude: 123,
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no description')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('Quest room creation should handle: no hint', (done) => {
    let testData = {
      roomName: 'test room',
      description: 'chaiDesc',
      longitude: 123,
      latitude: 123,
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no hint')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('Quest room creation should handle: no geolocation', (done) => {
    let testData = {
      roomName: 'test room',
      description: 'chaiDesc',
      hint: 'chaiTreasures',
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no geolocation')
      expect(res.body.data).to.be.undefined
      done()
    })
  })

  // it('Quest room creation should handle: with no file', (done) => {
  //   done()
  // })
  // it('Quest room creation should handle: with file', (done) => {
  //   done()
  // })

})

describe('API should handle wrong input type', () => {
  it('quest roomName check for wrong input type', (done) => {
    let testData = {
      roomName: { malicousObject: 'MWAHAHAHAHA'},
      description: 'chaiDesc',
      hint: 'chaiTreasures',
      latitude: -12355.123,
      longitude: 1534098.213
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no room name')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('quest description check for wrong input type', (done) => {
    let testData = {
      roomName: 'testRoomName',
      description: ['123',123,{maliciousThing: '<someScripts>'}],
      hint: 'chaiTreasures',
      latitude: -12355.123,
      longitude: 1534098.213
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no description')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('quest hint check for wrong input type', (done) => {
    let testData = {
      roomName: 'testRoomName',
      description: 'description test',
      hint: {objetHere: 'test'},
      latitude: -12355.123,
      longitude: 1534098.213
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no hint')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('quest latitude check for wrong input type', (done) => {
    let testData = {
      roomName: 'testRoomName',
      description: 'description test',
      hint: 'chaiTreasures',
      latitude: ['123',123,{maliciousThing: '<someScripts>'}],
      longitude: 1534098.213
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no geolocation')
      expect(res.body.data).to.be.undefined
      done()
    })
  })
  it('quest longitude check for wrong input type', (done) => {
    let testData = {
      roomName: 'testRoomName',
      description: 'description test',
      hint: 'chaiTreasures',
      latitude: 123123,
      longitude: ['123',123,{maliciousThing: '<someScripts>'}]
    }
    let uid = 'TESTUID123'
    chai.request(app)
    .post(`/treasure/new`)
    .type('form')
    .set('token', token)
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('no geolocation')
      expect(res.body.data).to.be.undefined
      done()
    })
  })

})

describe('testing upload image', () => {
  it('should be able to upload image', (done) => {
    let testData = {
      roomName: 'chaiTesting',
      description: 'chaiDesc',
      hint: 'chaiTreasures',
      longitude: 123,
      latitude: 123,
    }
    let uid = 'TESTUID123'
    fs.readFile(__dirname + '/servant_001.jpg', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        chai.request(app)
        .post(`/treasure/new`)
        .set('token', token)
        .attach('image', data, 'servant_001.jpg')
        .field('roomName', 'chaitesting')
        .field('description', 'chaiDesc')
        .field('hint', 'chaiTreasures')
        .field('longitude', 123)
        .field('latitude', 456)
        .end((err, res) => {
          console.log(res.error);
          console.log(err);
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.data).to.not.be.undefined
          expect(res.body.data.image_path).to.not.equal('N/A')
          testID = res.body.newId
          chai.request(app)
          .delete(`/treasure/delete/${testID}`)
          .set('token', token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('Room removed')
            done()
          })
        })
      }
    })
  }).timeout(5000)
  // it('should no be able to upload other files', (done) => {
  //   let testData = {
  //     roomName: 'chaiTesting',
  //     description: 'chaiDesc',
  //     hint: 'chaiTreasures',
  //     longitude: 123,
  //     latitude: 123,
  //   }
  //   let uid = 'TESTUID123'
  //   fs.readFile(__dirname + '/sample.txt', (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(data);
  //       chai.request(app)
  //       .post(`/treasure/new`)
  //       .set('token', token)
  //       .attach('image', data, 'servant_001.jpg')
  //       .field('roomName', 'chaitesting')
  //       .field('description', 'chaiDesc')
  //       .field('hint', 'chaiTreasures')
  //       .field('longitude', 123)
  //       .field('latitude', 456)
  //       .end((err, res) => {
  //         console.log(res.error);
  //         console.log(err);
  //         expect(err).to.be.null
  //         expect(res).to.have.status(200)
  //         expect(res.body.data).to.not.be.undefined
  //         expect(res.body.data.image_path).to.equal('N/A')
  //         testID = res.body.newId
  //         chai.request(app)
  //         .delete(`/treasure/delete/${testID}`)
  //         .set('token', token)
  //         .end((err, res) => {
  //           expect(err).to.be.null
  //           expect(res).to.have.status(200)
  //           expect(res.body.message).to.equal('Room removed')
  //           done()
  //         })
  //       })
  //     }
  //   })
  // }).timeout(4000)
})


describe('Update function should bad inputs', () => {
  it('update should not receive payload', (done) => {
    testID = 'falseID'
    const falsePayload = {
      malicousThing: ':v:v:v<Script>hahaha</Script>'
    }
    chai.request(app)
    .put(`/treasure/update/${testID}`)
    .set('token', token)
    .send(falsePayload)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('No data should be submitted')
      done()
    })
  }).timeout(4000)
  it('update should not wrong room inputs', (done) => {
    testID = 'falseID'
    chai.request(app)
    .put(`/treasure/update/${testID}`)
    .set('token', token)
    .send({})
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('Invalid room')
      done()
    })
  }).timeout(4000)
  it('update should not process suspicious params', (done) => {
    testID = 'somereallylongidthatcanbeperceivedascodeorberegexedtofindasubstansialcodeinsidethisstringthacanbedangerousifsendtouserbyanymeanspleasedonotdothisprotectandserveWAAAAHHHH'
    chai.request(app)
    .put(`/treasure/update/${testID}`)
    .set('token', token)
    .send({})
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(400)
      expect(res.body.message).to.equal('ID invalid')
      done()
    })
  }).timeout(4000)
})
