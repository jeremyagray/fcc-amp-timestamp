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

describe('GET views', async function() {
  it('returns the index', async function() {
    try {
      // Get the index page.
      const response = await chai.request(server)
        .get('/');

      expect(response).to.have.status(200);
      expect(response).to.be.html;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('returns /favicon.ico', async function() {
    try {
      // Get the favicon.
      const response = await chai.request(server)
        .get('/favicon.ico');

      expect(response).to.have.status(200);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('returns /style.css', async function() {
    try {
      // Get the style sheet.
      const response = await chai.request(server)
        .get('/style.css');

      expect(response).to.have.status(200);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('non-existent page returns 404', async function() {
    try {
      // Try to get a non-existent page.
      const response = await chai.request(server)
        .get('/unknown.html');

      expect(response).to.have.status(404);
      expect(response).to.be.html;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('non-existent API endpoint returns 404', async function() {
    try {
      // Try to get a non-existent page.
      const response = await chai.request(server)
        .get('/api/not/here');

      expect(response).to.have.status(404);
      expect(response).to.be.html;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
