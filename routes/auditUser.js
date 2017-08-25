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

    var sql = "select acc,status,name,studentID from userAcc natural join baseInformation where acc like'%"+searchCondition+"%' or status like'%"+searchCondition+"%' or name like'%"+searchCondition+"%' or studentID like'%"+searchCondition+"%' ;";
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
router.post('/userDetail', function(req, res, next) {
    
    console.log(req.body);

    var sql = " select photoaddress,studentCard,nickname,name,sex,college,studentID,status from useracc natural join baseInformation where acc = ?";
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
             json['status'] =result[0].status ;
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



//处理通过事件
router.post('/pass', function(req, res, next) {
    
    var acc = req.body.acc;
    
    var sql = "update userAcc set status='已通过' where acc = ?;";
    var sqlParams = [acc];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};
        //更改成功
        json['status'] = "已通过";
        res.send(json);
        res.end("");


    });

});


//处理驳回事件
router.post('/reject', function(req, res, next) {
    
    var acc = req.body.acc;
    console.log(req.body);
    var sql = "update userAcc set status='已驳回' where acc = ?;";
    var sqlParams = [acc];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};
        //更改成功
        json['status'] = "已驳回";
        res.send(json);
        res.end("");


    });

});




module.exports = router;