/* SPDX-License-Identifier: MIT
 *
 * Copyright 2020 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

// Hello API endpoint. 
router.get('', (request, response) => {
  return response
    .status(200)
    .json({
      'message': 'Hello from the FCC AMP Timestamp API.'
    });
});

module.exports = router;
