var express = require('express');
var router = express.Router();
var connection = require('../DB_config');

router.post('/', function (req, res, next)
{
	res.render('adminHome');
});

//返回首页html
router.post('/firstPage', function (req, res, next)
{
	res.render('firstPage');
});

//查询有多少用户待审核
router.post('/registerCheck', function (req, res, next)
{
	//var sql = "select count(*) as count from userAcc where status = '待审核';";
	var sql = "call registerCheck ();";
	var sqlParams = [];
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}
		console.log(result[0].count);
		var jason = {CheckNum: result[0].count};
		res.send(jason);
		res.end("");
	});
});

module.exports = router;

// router.post('/queryUserData', function(req, res, next) {});