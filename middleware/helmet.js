'use strict';

const helmet = require('helmet');

exports.config = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        '\'self\''
      ],
      scriptSrc: [
        '\'self\'',
        'localhost',
        '\'unsafe-inline\''
      ],
      scriptSrcElem: [
        '\'self\'',
        'localhost',
        '\'unsafe-inline\''
      ],
      styleSrc: [
        '\'self\'',
        'localhost',
        '\'unsafe-inline\''
      ]
    }},
  referrerPolicy: {
    policy: 'same-origin'
  },
  frameguard: {
    action: 'sameorigin'
  }});
