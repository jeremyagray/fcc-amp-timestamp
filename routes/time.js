'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const timeController = require('../controllers/time.js');

router.get('',
           timeController.getNow
          );

router.get('/:date_string',
           validation.validateDateString,
           timeController.getDateString
          );

module.exports = router;
