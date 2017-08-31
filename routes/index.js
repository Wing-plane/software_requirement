var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');
var path = require('path');




//安卓端用户首页
router.post('/', function (req, res)
{

	//console.log('jin lai le!');

    var searchCondition = req.body.searchCondition;
	console.log(searchCondition);

    var sql;
	var sqlParams;
	if (searchCondition == undefined)
	{   
        //搜索条件是空就随机搜索10条
		sql = "select * from product where status = 0;";
		sqlParams = [];
	}
	else
	{
		sql = "select * from product where name like '%" + searchCondition + "%' or price like '%" + searchCondition + "%' or detail like '%" + searchCondition + "%' where status = 0;";
		sqlParams = [];

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
				subjson['seller_name'] = result[i].acc;
				subjson['type'] = result[i].type;
				subjson['productID'] = result[i].productID;


				var dir = path.join(__dirname,"../public/img/user/"+result[i].acc+"/"+result[i].acc+"_h.png");
				if(fs.existsSync(dir)){
					var imageBuf = fs.readFileSync(dir);
					subjson['seller_photo'] = imageBuf.toString("base64");
				}else{
					subjson['seller_photo'] = "";
				}
				
				array.push(subjson);              
            }

		}

		json['index'] = array;
		console.log(json);
		res.send(json);
		res.end("");
	});


});


module.exports = router;