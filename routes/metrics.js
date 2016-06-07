var express = require('express');  
var router = express.Router();

var elastic = require('../elasticsearch');

/* 
POST document to be indexed 

test inputs entered here. Service monitor tobe added.
*/
router.post('/', function (req, res, next) {  
  elastic.addDocument(req.body).then(function (result) { res.json(result) });
});

module.exports = router;