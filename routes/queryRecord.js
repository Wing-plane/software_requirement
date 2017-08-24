var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回订单查询界面html
router.get('/queryRecord', function(req, res, next) {
    res.render('queryRecord');

});



module.exports = router;