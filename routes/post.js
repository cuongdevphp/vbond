var express = require('express');
var db = require('../db');
var router = express.Router();
//const sql = await require('./db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
        db.query('INSERT INTO messages SET ?', post, function(err, result) {
      if (err) throw err;
    });

  res.send('respond with a resource');
});

module.exports = router;
