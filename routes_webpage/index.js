var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index',
        {
            title: 'Gage Talk',
            subtitle1: ' 로그인',
            subtitle2: '상점주 관리',
            subtitle3: '고객 관리'
        });
});

module.exports = router;
