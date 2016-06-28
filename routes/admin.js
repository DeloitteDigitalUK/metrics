var express = require('express');
var router = express.Router();
var elastic = require('../elasticsearch');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res) {
  
  elastic.getConfig(function (err, result) {
    if (err) {
      res.render('admin', {esRecords: []}); 
      return console.log(err);
    }
    var records = _.get(result, 'hits.hits');
    console.log(records);
    res.render('admin', {esRecords: records}); 
  });
});

/*  Allow new jobs to be added */

router.post('/', function (req, res) {
    var record = {
      project: req.body.project,
      jobUrl: req.body.jobUrl,
      component: req.body.component
    };

    console.log(record);

    elastic.addConfiguration(record).then(function (result) {
      console.log('The record created!');
      console.log(result);

      res.redirect('/admin');
    });   
});

/*  This responds delete job */
router.delete('/', function (req, res) {
   res.send('DELETE job');
})

/*  This responds a GET request for the /list_user page. */
router.get('/list_job', function (req, res) {
   res.send('listing jobs');
})

module.exports = router;
