'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const chaiDate = require('chai-datetime');

chai.use(chaiDate);
chai.use(chaiHttp);

const server = require('../server.js');

describe('GET /api/timestamp', async function() {
  it('tells current time', async function() {
    try {
      let now = new Date();

      let response = await chai.request(server)
          .get('/api/timestamp');

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.a('object');

      expect(response.body).to.have.property('unix');
      expect(response.body).to.have.property('utc');

      const unix = new Date(response.body.unix);
      const utc = new Date(response.body.utc);

      expect(unix).to.be.closeToTime(now, 1);
      expect(unix).to.be.closeToTime(utc, 1);
      expect(utc).to.be.closeToTime(now, 1);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
