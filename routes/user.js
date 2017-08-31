var express = require('express');
var router = express.Router();
var connection = require('../DB_config');
var fs = require('fs');
var path = require('path');

//同步执行多条语句
var conf = require('../DB_config_nc');
require('mysql-queries').init(conf);
var mq = require('mysql-queries');



//安卓端用户注册
router.post('/register', function (req, res)
{

	//console.log('jin lai le!');

    var acc = req.body.acc;
    var pwd = req.body.pwd;

    var sql;
	var sqlParams;
	  
    //先搜索看看有没有注册过
	sql = "select * from userAcc where acc = ?;";
	sqlParams = [acc];
	
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}

        //如果没有注册过
        if(result.length == 0){

                    sql = 'insert into userAcc valuse(?,?,?,?,?,?);';
                    sqlParams = [acc,pwd,acc,"",100,0];

                    bsql = 'insert into baseInformation values(?,?,?,?,?,?) ';
                    bsqlParams = [acc,"","","","",""];
                    //在这里同步插入
                    mq.query([sql,bsql],
                    [sqlParams,bsqlParams],
                    function(err,result){

                    if (err)
                        {
                            console.log('error:', err.message);
                            return;
                        }

                        //****************创建文件夹********************* */
                        var dir = path.join(__dirname,"../public/img/user/"+acc);
                        if(fs.existsSync(dir)){
                            //假如存在则不创建
                        }else{
                            //不存在则创建文件夹
                            fs.mkdirSync(dir);
                        }

                        res.send(  {register : [{verify:"true"}]}  );
                        res.end('');

                    });

                }else{
                    //如果注册过了
                    res.send(  {register : [{verify:"false"}]}  );
                    res.end('');
                }
	
	});

    
});


//安卓端用户登陆
router.post('/login', function (req, res)
{


    var acc = req.body.acc;
    var pwd = req.body.pwd;

    var sql;
	var sqlParams;
	  
    //先搜索看看有没有注册过
	sql = "select * from userAcc where acc = ? and pwd = ?;";
	sqlParams = [acc,pwd];
	
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
			return;
		}

        //如果没有注册过
        if(result.length == 0){
            
            //不允许登陆
            res.send(  {login : [{permission:"false"}]}  );
            res.end('');
          
        }else{

            //允许登陆
            res.send(  {login : [{permission:"true"}]}  );
            res.end('');
   

        }
	
	});

     
});


//查审核状态
router.post('/checkVerify', function (req, res)
{


    var acc = req.body.acc;

    var sql;
	var sqlParams;
	  
    //先搜索看看有没有注册过
	sql = "select * from userAcc where acc = ?;";
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
            res.send(  {checkVerify : [{verify:"false"}]}  );
            res.end('');
          
        }else{

            
            var base64;
            var dir = path.join(__dirname,"../public/img/user/"+acc+"/"+acc+"_h.png");
                                if(fs.existsSync(dir)){
                                        imageBuf = fs.readFileSync(dir);
                                        base64 = imageBuf.toString("base64");
                                }else{
                                        base64 = "";
                                }
            //查到
            res.send(  {checkVerify : [{verify:result[0].status,nickname:result[0].nickname,photo:base64}]}  );
            res.end('');

        }
	
	});

     
});


//安卓端提交审核信息
router.post('/verify', function (req, res)
{

    console.log('提交审核信息');
    console.log(req.body);

    var acc = req.body.acc;
    var studentCard = req.body.studentCard;
    var studentID = req.body.studentID ;
    var name= req.body.studentID ;
    var sex= req.body.studentID;
    var college= req.body.studentID;

    var sql;
	var sqlParams;
	  
    //直接进行更新
	sql = "update baseInformation set studentID=?,name=?,sex=?,college=? where acc = ?;";
	sqlParams = [studentID,name,sex,college,acc];

    //进行图片处理
    var dir = path.join(__dirname,"../public/img/user/"+acc+"/"+acc+"_s.png");
    //将图片转成base64 并保存
    var buf = new Buffer(studentCard, 'base64');
    fs.writeFile(dir, buf);
	
	connection.query(sql, sqlParams, function (err, result)
	{
		if (err)
		{
			console.log('error:', err.message);
             res.send(  {verify : [{verify:"false"}]}  );
            res.end('');
			return;
		}
           
        //查到
        res.send(  {verify : [{verify:"true"}]}  );
        res.end('');
   	
	});

});




module.exports = router;