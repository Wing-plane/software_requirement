var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

router.get('/', function(req, res, next) {
    res.render('adminHome');

});


//返回首页html
router.get('/firstPage', function(req, res, next) {
    res.render('firstPage');

});

//查询有多少用户待审核
router.get('/registerCheck', function(req, res, next) {
    var jason = {CheckNum:5};
    res.send(jason);
    res.end("");

});


//返回用户查询界面html
router.get('/queryUser', function(req, res, next) {
    res.render('queryUser');

});

//点击查询后根据条件返回用户信息
router.post('/queryUserData', function(req, res, next) {

    console.log(req.body);

    var searchCondition = req.body.searchCondition;
    var creditFrom = req.body.creditFrom;
    if(creditFrom == ''){creditFrom = 0;}
    var creditTo = req.body.creditTo;
    if(creditTo == ''){creditTo = 100;}

    var sql = "select acc,nickname,name,college,credit from userAcc natural join baseinformation where ( acc like'%"+searchCondition+"%' or nickname like'%"+searchCondition+"%' or name like'%"+searchCondition+"%' or college like'%"+searchCondition+"%' ) and (credit between "+creditFrom+" and "+creditTo+");";
    var sqlParams = [];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};
       // console.log(result[0].acc);

        if(result.length == 0){
            //查不到
            // json['acc'] = false;

        }else{
            //能查询到
            json['result'] = result;
            console.log(json);
        }

        res.send(json);
        res.end("");


    });



});

module.exports = router;