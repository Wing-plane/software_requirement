var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

//返回商品查询界面html
router.post('/queryProduct', function(req, res, next) {
    res.render('queryProduct');

});

//处理查询
router.post('/queryProductData', function(req, res, next) {

    console.log('searchCondition');

    var searchCondition = req.body.searchCondition;


    var sql;

    if(searchCondition == ""){
        sql = "select productID,acc,status,name from product;"
    }else{
        sql = "select productID,acc,status,name from product where productID like '%"+searchCondition+"%' or acc like '%"+searchCondition+"%' or status like '%"+searchCondition+"%' or name like '%"+searchCondition+"%';"
    }

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