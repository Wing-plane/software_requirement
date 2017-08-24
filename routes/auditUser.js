var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回用户审核界面html
router.get('/auditUser', function(req, res, next) {
    res.render('auditUser');

});




module.exports = router;