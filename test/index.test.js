const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp)

let testID;

describe('firebase crud', () => {
  it('should access app without any problem', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done()
    })
  })
  it('adding new room data should work', (done) => {
    let testData = {
      roomName: 'chaiTesting2',
      description: 'chaiDesc',
      treasures: 'chaiTreasures'
    }
    chai.request(app)
    .post('/treasure/new')
    .type('form')
    .send(testData)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.data.roomName).to.equal(testData.roomName)
      expect(res.body.data.description).to.equal(testData.description)
      testID = res.body.newId
      done()
    })
  })
  it('should update data', (done) => {
    chai.request(app)
    .put(`/treasure/update/${testID}`)
    .send({})
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.message).to.equal('Room sucessfully completed')
      done()
    })
  })
  it('should delete data', (done) => {
    chai.request(app)
    .delete(`/treasure/delete/${testID}`)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.body.message).to.equal('Room removed')
      done()
    })
  })
})
