var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');
var path = require('path');

//查审核状态
router.post('/profile', function (req, res)
{


    var acc = req.body.acc;

    var sql;
	var sqlParams;
	  
    //先搜索看看有没有注册过
	sql = "select * from userAcc natural join baseInformation where acc = ?;";
	sqlParams = [acc];
	
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}

        //
        if(result.length == 0){
            
            //找不到
            res.send( {} );
            res.end('');
          
        }else{

            //处理用户头像
            var base64;
            var dir = path.join(__dirname,"../public/img/user/"+acc+"/"+acc+"_h.png");
				if(fs.existsSync(dir)){
					imageBuf = fs.readFileSync(dir);
					base64 = imageBuf.toString("base64");
				}else{
					base64 = "";
				}
            
            //查到
            res.send(  {profile : [ { nickname:result[0].nickname, sex:result[0].sex, photo:base64, studentID :result[0].studentID , name:result[0].name, sex:result[0]. sex, college:result[0].college, credit:result[0].credit}]}  );
            res.end('');
  

        }
	
	});

     
});



//我上架的，我卖出的，我买入的
function ubs(status,acc,res){

	var sql; 
	var sqlParams; 

	if(status == "0"){
		//我上架的
		sql = "select acc as seller,name,price,detail from product natural join record where acc = ?;";
		sqlParams = [acc];

	}
	if(status == "1"){
		//我卖出的
		sql = "select seller,name,price,detail from product natural join record where seller = ? and product.status = '1';";
		sqlParams = [acc];
	}
	if(status == "2"){
		//我买入的
		sql = "select seller,name,price,detail from product natural join record where buyer = ?;";
		sqlParams = [acc];
	}
	

	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}

		var json = {};
		var array = new Array();
		 console.log(result);


		if (result.length === 0)
		{
			//查不到
			// json['acc'] = false;
		}
		else
		{
			//能查询到
            //遍历result
            for (var i = 0; i < result.length; i++) {

				var subjson = {};
				subjson['production_name'] = result[i].name;
				subjson['price'] = result[i].price;
				subjson['detail'] = result[i].detail;
				 subjson['seller_name'] = result[i].seller;

				var dir = path.join(__dirname,"../public/img/user/"+result[i].seller+"/"+result[i].seller+"_h.png");
				if(fs.existsSync(dir)){
					var imageBuf = fs.readFileSync(dir);
					subjson['seller_photo'] = imageBuf.toString("base64");
				}else{
					subjson['seller_photo'] = "";
				}
				
				array.push(subjson);              
            }

		}

		json['ubs'] = array;
		console.log(json);
		res.send(json);
		res.end("");


	});

}

router.post('/upload', function (req, res)
{
	ubs(0,req.body.acc,res);
});

router.post('/buy', function (req, res)
{
	ubs(1,req.body.acc,res);
});

router.post('/sold', function (req, res)
{
	ubs(2,req.body.acc,res);
});


//查询我的订单
router.post('/record', function (req, res)
{

	var acc = req.body.acc;

	var sql = 'select * from record where seller = ? or buyer = ?'; 
	var sqlParams=[acc,acc]; 

	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}

		var json = {};
		var array = new Array();
		console.log(result);


		if (result.length === 0)
		{
			//查不到
			// json['acc'] = false;
		}
		else
		{
			//能查询到
            //遍历result
            for (var i = 0; i < result.length; i++) {

				var subjson = {};
				subjson['recordID'] = result[i].recordID;
				subjson['productID'] = result[i].productID;
				subjson['seller'] = result[i].seller;
				subjson['buyer'] = result[i].buyer;
				subjson['time'] = result[i].time;
				subjson['status'] = result[i].status;
				subjson['sellerMark'] = result[i].sellerMark;
			    subjson['buyerMark'] = result[i].buyerMark;
				
				array.push(subjson);              
            }

		}

		json['record'] = array;
		console.log(json);
		res.send(json);
		res.end("");


	});


});


//修改我的资料
router.post('/editPprofile', function (req, res)
{


});



module.exports = router;