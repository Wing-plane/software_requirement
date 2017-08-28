var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');

router.get('/', function (req, res)
{
	res.render('login');
});

router.post('/login_verify', function (req, res)
{
	// fs.mkdir("./tmp", function (err)
	// {
	// 	if (err)
	// 	{
	// 		return console.error(err);
	// 	}
	// 	console.log("目录创建成功。");
	// });
	//var sql = "select * from adminAcc where acc=? and pwd=?";
	var sql = "call login_verify (?, ?);";
	var sqlParams = [req.body.username, req.body.password];
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}
		var json = {};
		json['verify'] = result.length !== 0;
		res.send(json);
		res.end("");
	});
});

module.exports = router;