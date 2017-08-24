
var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.render('login');

});

router.post('/login_verify', function(req, res, next) {

//     fs.mkdir("./tmp",function(err){
//    if (err) {
//        return console.error(err);
//    }
//    console.log("目录创建成功。");
//     });
   
    var sql = 'select * from adminAcc where acc=? and pwd=?';
    var sqlParams = [req.body.username,req.body.password];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};

        if(result.length == 0){
            //能查询到
            json['verify'] = false;

        }else{
            //不能查询到
            json['verify'] = true;

        }

        res.send(json);
        res.end("");


    });

});



module.exports = router;
