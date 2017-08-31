var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');
var path = require('path');

//同步执行多条语句
var conf = require('../DB_config_nc');
require('mysql-queries').init(conf);
var mq = require('mysql-queries');


//获取系统当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "-" + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


//下单
router.post('/order', function (req, res)
{

    console.log('下单');
    console.log(req.body);

    var buyer = req.body.buyer;
    var productID = req.body.productID;
    var seller = req.body.seller;

    var time = getNowFormatDate();
    console.log(time);

    var recordID = productID+'-'+time;

    var sql;
	var sqlParams;
	  
    //直接进行更新
	sql = "update product set status = 1 where productID =?;";
	sqlParams = [productID];

    rsql = "insert into record values(?,?,?,?,?,?,?,?);";
	rsqlParams = [recordID,productID,seller,buyer,time,0,"",""];


    mq.query([sql,rsql],
    [sqlParams,rsqlParams],
    function(err,result){

    if (err)
        {
            console.log('error:', err.message);
            return;
        }

  
        res.send(  {order : [{recordID:recordID}]}  );
        res.end('');

    });


});


//商品发布
router.post('/publish', function (req, res)
{

    console.log('发布');
    console.log(req.body);

    var acc = req.body.acc;
    var status = 0;
    var name = req.body.name;
    var price = req.body.price;
    var detail = req.body.detail;
    var type = req.body.type;

    var productImage = eval(req.body.productImage);// array
    var photoNum = productImage.length;

     //var dir = path.join(__dirname,"../public/img/user/"+acc+"/");
     
    var sql;
	var sqlParams;
	  
   
	sql = "insert into product(acc,status,name,price,detail,type,photoNum) values(?,?,?,?,?,?,?) ;";
	sqlParams = [acc,status,name,price,detail,type,photoNum];

    mq.query([sql],
    [sqlParams],
    function(err,result){

    if (err)
        {
            console.log('error:', err.message);
            res.send(  {publish:[{ verrify:"false"}]}  );
            res.end();
            return;
        }

                            sql = "select productID from product where acc = ? and status = ? and name = ? and price = ? and detail = ? and type = ? and photoNum = ?;";
                            sqlParams = [acc,status,name,price,detail,type,photoNum];
                            mq.query([sql],
                            [sqlParams],
                            function(err,result){

                            if (err)
                                {
                                    console.log('error:', err.message);
                                    res.send(  {publish:[{ verrify:"false"}]}  );
                                    res.end();
                                    return;
                                }

                                //先根据id创建商品文件夹
                                 var dir = path.join(__dirname,"../public/img/user/"+acc+"/"+result[0].productID);
                                 fs.mkdirSync(dir);
                                //图片存储
                                //保存图片
                                for (var index = 0; index < photoNum; index++) {                                  
                                    var buf = new Buffer(productImage[index], 'base64');
                                    fs.writeFile(dir+"/"+index+'.png', buf);
                                    
                                }

                                res.send(  {publish:[{ verrify:"true"}]}  );
                                res.end();

                            });

    });


});


//商品详情
router.post('/detail', function (req, res)
{

    console.log('详情');
    console.log(req.body);

    var productID = req.body.productID;
    
    var sql;
	var sqlParams;
	  
	sql = "select * from product where productID = ?;";
	sqlParams = [productID];

    mq.query([sql],
    [sqlParams],
    function(err,result){

    if (err)
        {
            console.log('error:', err.message);
            return;
        }

        var subjson = {};
        subjson['productID'] = result[0].productID;
        subjson['acc'] = result[0].acc;
        subjson['status'] = result[0].status;
        subjson['name'] = result[0].name;
        subjson['price'] = result[0].price;
        subjson['detail'] = result[0].detail;
        subjson['type'] = result[0].type;

        var photoNum = result[0].photoNum;
        var photoarr = [];

        //处理图片
        var dir = path.join(__dirname,"../public/img/user/"+result[0].acc+"/");
        for (var index = 0; index < photoNum; index++) {

            if(fs.existsSync(dir+index+".png")){
					var imageBuf = fs.readFileSync(dir);
					photoarr.push(imageBuf.toString("base64"));
				}

        }
        subjson['productImage'] = photoarr;
        var arr = [];
        arr.push(subjson);
        var json = {};
        json['detail'] = arr;
				
        console.log(json);
        res.send( json );
        res.end();

    });


});


module.exports = router;