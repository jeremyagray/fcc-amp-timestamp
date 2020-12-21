'use strict';

// Load the environment variables.
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

// Middleware.
const helmet = require('./middleware/helmet.js');

// Routing.
const helloRoute = require('./routes/hello.js');
const timeRoutes = require('./routes/time.js');

// Express.
const app = express();

async function start() {
  try {
    // Helmet middleware.
    app.use(helmet.config);
    
    // Serve the favicon.
    app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));
    
    // Use body parser for post data.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // app.set('trust proxy', true);

    // Set static directory.
    app.use('/public', express.static(path.join(process.cwd(), 'public')));

    // Set view directory and view engine.
    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'pug');

    // Serve index.
    app.route('/')
      .get(function(request, response) {
        return response.render('index');
      });

    // Serve views.
    // app.route('/:page')
    //   .get(function(request, response) {
    //     return response.render(request.params.page);
    //   });

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
    const port = process.env.PORT || 3000;
    const name = 'fcc-amp-timeserver';
    const version = '0.0.1';

    await app.listen(port);
    console.log(`${name}@${version} listening on port ${port}...`);
    if (process.env.NODE_ENV === 'test') {
      console.log(`${name}@${version} ready to run tests...`);
    }
  } catch (error) {
    console.error(error);
  }
}

// Start the server.
(async function() { await start(); })();

// Export app for testing.
module.exports = app;
