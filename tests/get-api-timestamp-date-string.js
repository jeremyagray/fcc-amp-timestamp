/* SPDX-License-Identifier: MIT
 *
 * Copyright 2020 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const chaiDate = require('chai-datetime');

chai.use(chaiDate);
chai.use(chaiHttp);

const server = require('../server.js');

describe('GET /api/timestamp/:date_string', async function() {
  describe('valid dates', async function() {
    it('ISO-8601 date string should return valid date', async function() {
      try {
        let date = '2019-12-25';
        let dateObj = new Date(date);

        let response = await chai.request(server)
          .get(`/api/timestamp/${date}`);

        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.a('object');

        expect(response.body).to.have.property('unix');
        expect(response.body).to.have.property('utc');

        const unix = new Date(response.body.unix);
        const utc = new Date(response.body.utc);

        expect(dateObj).to.equalTime(unix);
        expect(dateObj).to.equalTime(utc);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  });

  describe('invalid dates', async function() {
    it('should return invalid date', async function() {
      try {
        const invalidDates = [
          'bob-is-your-uncle',
          'h@ckm3',
          '&&'
        ];


        for (let i = 0; i < invalidDates.length; i++) {
          let response = await chai.request(server)
          // eslint-disable-next-line security/detect-object-injection
            .get('/api/timestamp/' + invalidDates[i].toString());

          // FCC tests fail on status 400.
          // expect(response).to.have.status(400);
          expect(response).to.be.json;
          expect(response.body).to.be.a('object');

          expect(response.body).to.have.property('error');
          expect(response.body).to.have.property('error').eql('Invalid Date');
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  });
});
