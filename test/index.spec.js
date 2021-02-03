const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);
describe('ip insert', () => {
    const user23_buy_ABX = {
        "firstname": "ashish",
        "lastname": "jadhav",
        "password": "123456",
        "email": "aj@pricebid.co",
        "username": "ajSupport",
        "status": "ACTIVE"
    }
    it('should create a new records', async () => {
        const response = await chai.request(server).post('/createUser').send(user23_buy_ABX)
        response.should.have.status(201);
        delete response.body.id;
        response.body.should.eql(user23_buy_ABX)
    });
    it('search record', async () => {
        const response = await chai.request(server).post('/read').send(user23_sell_AAC)
        response.should.have.status(201);
        delete response.body.id;
        response.body.should.eql(user23_sell_AAC)
    });
});
