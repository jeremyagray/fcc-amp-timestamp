'use strict';

// Load the environment variables.
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const winston = require('winston');

// Test runner.
const runner = require('./runner.js');

// Middleware.
const helmet = require('./middleware/helmet.js');
const logger = require('./middleware/logger.js');

// Routing.
const helloRoute = require('./routes/hello.js');
const timeRoutes = require('./routes/time.js');

// Express.
const app = express();

// Configuration variables.
const port = process.env.PORT || 3000;
const name = 'fcc-amp-timeserver';
const version = '0.3.0';

async function start() {
  try {
    // Logging middleware.
    if (process.env.NODE_ENV === 'development') {
      // Development:  dump to console.
      logger.clear();
      logger.add(new winston.transports.Console({
        'level': 'silly',
        'format': winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )}));
      app.use(morgan('dev', {
        'stream': {
          'write': (message) => {
            logger.info(message.trim());
          }
        }}));
    } else if (process.env.NODE_ENV === 'test') {
      // Testing:  silence for tests.
      logger.clear();
      logger.silent = true;
    } else {
      // Production:  defaults.
      app.use(morgan('combined', {
        'stream': {
          'write': (message) => {
            logger.info(message.trim());
          }
        }}));
    }

    // Helmet middleware.
    app.use(helmet.config);
    
    // Use CORS.
    app.use(cors({
      origin: '*',
      optionSuccessStatus: 200
    }));

    // Favicon serving middleware.
    app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));
    
    // Use body parser for post data.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Set static directory.
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Set view directory and view engine.
    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'pug');

    // Serve index.
    app.route('/')
      .get(function(request, response) {
        return response.render('index');
      });

    // Application routes.
    app.use('/api/hello', helloRoute);
    app.use('/api/timestamp', timeRoutes);
    
    // 404 middleware.
    app.use((request, response) => {
      return response
        .status(404)
        .render('404');
    });

    // Run server and/or tests.
    await app.listen(port);
    logger.info(`${name}@${version} listening on port ${port}`);
    if (process.env.NODE_ENV === 'test'
        || process.env.NODE_ENV === 'development') {
      logger.info(`${name}@${version} preparing to run tests`);
      setTimeout(function () {
        try {
          runner.run();
        } catch (error) {
          logger.info(`${name}@${version}:  some tests failed`);
          logger.error(error);
        }
      }, 1500);
    }
  } catch (error) {
    logger.error(error);
    logger.error(`${name}@${version} cowardly refusing to continue with errors...`);
  }
}

// Start the server.
(async function() {
  await start(); 
})();

// Export app for testing.
module.exports = app;
