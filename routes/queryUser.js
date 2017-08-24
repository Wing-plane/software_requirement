var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回用户查询界面html
router.post('/queryUser', function(req, res, next) {
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

    var sql = "select acc,nickname,name,college,credit from userAcc natural join baseInformation where ( acc like'%"+searchCondition+"%' or nickname like'%"+searchCondition+"%' or name like'%"+searchCondition+"%' or college like'%"+searchCondition+"%' ) and (credit between "+creditFrom+" and "+creditTo+");";
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


//处理详细信息的查询请求
router.post('/userDetail', function(req, res, next) {
    console.log(req.body);
    //

    var sql = " select photoaddress,studentCard,nickname,credit,name,sex,college,studentID from useracc natural join baseInformation where acc = ?";
    var sqlParams = [req.body.acc];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};
        //console.log(result);

        if(result.length == 0){
            //查不到
            

        }else{
            //能查询到
             json['photo'] =result[0].photoaddress;
             json['studentCard'] =result[0].studentCard;
             json['acc'] = req.body.acc;
             json['nickname'] =result[0].nickname ;
             json['credit'] =result[0].credit ;
             json['name'] =result[0].name ;
             json['sex'] =result[0].sex ;
             json['college'] =result[0].college ;
             json['studentID'] =result[0].studentID ;
             console.log(json);
        }

        res.send(json);
        res.end("");


    });

});



module.exports = router;