var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回用户审核界面html
router.post('/auditUser', function(req, res, next) {
    res.render('auditUser');

});

//点击查询按钮后引发事件
router.post('/auditUserData', function(req, res, next) {
    
    var searchCondition = req.body.searchCondition;

    var sql = "select acc,pwd,name,studentID from userAcc natural join baseInformation where acc like'%"+searchCondition+"%' or pwd like'%"+searchCondition+"%' or name like'%"+searchCondition+"%' or studentID like'%"+searchCondition+"%' ;";
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

//返回详细信息
router.post('/userAudit', function(req, res, next) {
    
    console.log(req.body);

    // var sql = " select photoaddress,studentCard,nickname,name,sex,college,studentID from useracc natural join baseInformation where acc = ?";
    // var sqlParams = [req.body.acc];

    // connection.query(sql,sqlParams,function(err,result){

    //     if(err){
    //         console.log('error:',err.message);
    //         return;
    //     }

    //     var json={};
    //     //console.log(result);

    //     if(result.length == 0){
    //         //查不到
            

    //     }else{
    //         //能查询到
    //          json['photo'] =result[0].photoaddress;
    //          json['studentCard'] =result[0].studentCard;
    //          json['acc'] = req.body.acc;
    //          json['nickname'] =result[0].nickname ;
    //          json['credit'] =result[0].credit ;
    //          json['name'] =result[0].name ;
    //          json['sex'] =result[0].sex ;
    //          json['college'] =result[0].college ;
    //          json['studentID'] =result[0].studentID ;
    //          console.log(json);
    //     }

    //     res.send(json);
    //     res.end("");


    // });

});

module.exports = router;