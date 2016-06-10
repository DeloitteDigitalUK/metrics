var express = require('express');  
var router = express.Router();

var elastic = require('../elasticsearch');

/* 
POST document to be indexed 

test inputs entered here. Service monitor tobe added.
*/
router.get('/', function (req, res, next) {  
  res.render('index', { title: 'test routes' });
});

module.exports = router;