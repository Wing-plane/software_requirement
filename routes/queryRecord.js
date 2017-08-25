var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回订单查询界面html
router.post('/queryRecord', function(req, res, next) {
    res.render('queryRecord');

});


//根据条件返回订单信息
router.post('/queryRecordData', function(req, res, next) {
    
    var searchCondition = req.body.searchCondition;

    var sql = "select recordID,productID,time,status from record where recordID like'%"+searchCondition+"%' or productID like'%"+searchCondition+"%' or time like'%"+searchCondition+"%' or status like'%"+searchCondition+"%' ;";
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
            //console.log(json);
        }

        res.send(json);
        res.end("");

    });

});

router.post('/recordDetail', function(req, res, next) {
    
    console.log(req.body);
    var recordID = req.body.acc;

    var sql = " select * from record where recordID = ?";
    var sqlParams = [req.body.acc];

    connection.query(sql,sqlParams,function(err,result){

        if(err){
            console.log('error:',err.message);
            return;
        }

        var json={};
        console.log(result);

        if(result.length == 0){
            //查不到
            

        }else{
            //能查询到
             json['recordID'] =result[0].recordID;
             json['productID'] =result[0].productID;
             json['seller'] =result[0].seller ;
             json['buyer'] =result[0].buyer ;
             json['time'] =result[0].time ;
             json['status'] =result[0].status ;
             json['sellerMark'] =result[0].sellerMark ;
             json['buyerMark'] =result[0].buyerMark ;
             console.log(json);
        }

        res.send(json);
        res.end("");


    });

});




module.exports = router;