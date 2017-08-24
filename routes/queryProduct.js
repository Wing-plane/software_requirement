var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回商品查询界面html
router.get('/queryProduct', function(req, res, next) {
    res.render('queryProduct');

});




module.exports = router;