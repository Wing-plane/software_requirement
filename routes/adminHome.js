var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

router.post('/', function(req, res, next) {
    res.render('adminHome');

});


//返回首页html
router.post('/firstPage', function(req, res, next) {
    res.render('firstPage');

});

//查询有多少用户待审核
router.post('/registerCheck', function(req, res, next) {
    var jason = {CheckNum:5};
    res.send(jason);
    res.end("");

});


module.exports = router;

// router.post('/queryUserData', function(req, res, next) {});