/**
 * Created by hyochan on 5/3/15.
 */
var express = require('express');
var router = express.Router();
var response = require('../const/response_code');
var connection = require('../database/mysql_pool');

/* test chat page */
router.get('/', function(req, res) {
    res.render('chatapp');
});


module.exports = router;
