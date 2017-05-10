var express 	= require('express');
var app 	= express();
var http 	= require('http').Server(app);
var io 		= require('socket.io')(http);
var path	= require('path');
var mysql 	= require('mysql');

var connection = mysql.createConnection({
	// no
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function()
{
	console.log('listening on port *:3000');	
});

connection.connect();
// queries db every 5sec to keep connection alive
// less evil than it sounds
setInterval(function()
{
	connection.query('SELECT 1');
}, 5000);


var socket = io.of();				// default namespace
var socket1 = io.of('/1');

// defines a namespace for 32 train lines (16 lines, 2 directions each)
var nsp_pool = new Array();
for (i = 1; i < 33; i++)
{
	var nsp = init_nsp(i);
	nsp_pool[i] = nsp;
}

// initiates a namespace called line_id
function init_nsp(line_id)
{
	var nsp = io.of(line_id);
	nsp.on('connection', function()
	{
		console.log('user connected on line ' + line_id);
	});
	// more bound behaviors go here
	// .......
	return nsp;
}



// when client first connects, sends pageload data
io.on('connection', function(socket)
{
	console.log('user connected!');
	connection.query('SELECT * FROM trainlines ORDER BY id ASC', function(error, rows, fields)
	{
		socket.emit('init_data', rows);
		// console.log(rows);
	});
});
