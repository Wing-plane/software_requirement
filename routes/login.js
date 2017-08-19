/**
 * Created by ASUS on 2017/8/17.
 */
var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/login_verify', function(req, res, next) {
   
    var sql = 'select * from adminAcc where acc=? and pwd=?';
    var sqlParams = [req.body.username,req.body.password];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error',err.message);
            return;
        }

        if(result.length == 0){

            //找不到

        }else{
            //返回界面
            

        }

    });




});


module.exports = router;
