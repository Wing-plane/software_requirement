var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'sdw5866336',
	database: 'SCUTSecondHand'
});

module.exports = connection;