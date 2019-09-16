var express=require('express');
var session=require('express-session');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var file = 'data.db';//这里写的就是数据库文件的路径
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var ejs = require('ejs');

const {SHA256} = require('crypto-js');

app.engine('html', ejs.__express);
app.set('view engine', 'html');

var sessionMiddleware = session({
secret: 'dev',
resave: false,
saveUninitialized: true,
cookie: { maxAge: 30*24*60*1000 }
});
io.use((socket, next) => {
sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);

//二维数组data的定义和初始化
var data = new Array();
    for(var i=0;i<46;i++){        //46行
        data[i] = new Array();
            for(var j=0;j<32;j++){    //32列
                data[i][j] = 0;
            }
    }
var location=new Array();
	for(var i=0;i<46;i++){
		location[i]=new Array();
			for(var j=0;j<32;j++){
				location[i][j]=0;
			}
	}
//蛇身、当前方向、食物位置
var snake_body, direction, food_position,snake_body1,direction1,snake_body2,direction2;
//控制能否移动
var begin=0;
var player1=0;
var player2=0;
var player3=0;
var speed=200;
var level=1;
var option=0;
//暂停
function pause()
{
	begin=0;
	move_snake();
	move_snake1();
	move_snake2();
}

	// 初始化蛇身
function init_snake() {
	snake_body = [{
		x: 40,
		y: 40,			
	}, {
		x: 60,
		y: 40,				
	}, {
		x: 80,
		y: 40,			
	}]
			// snake move direction
	direction = 'right'
			// food position
	food_position = {
		x: 260,
		y: 220
	}
}
function init_snake1() {
	snake_body1 = [{
		x: 440,
		y: 440,	
	}, {
		x: 440,
		y: 420,	
	}, {
		x: 440,
		y: 400,		
	}]
	// snake move direction
	direction1 = 'top'
	// food position
	food_position = {
		x: 260,
		y: 220
	}
}
function init_snake2() {
	snake_body2 = [{
		x: 440,
		y: 200,	
	}, {
		x: 440,
		y: 220,	
	}, {
		x: 440,
		y: 240,		
	}]
	// snake move direction
	direction2 = 'bottom'
	// food position
	food_position = {
		x: 260,
		y: 220
	}
}
function changeDirection(keyCode) {
	if(keyCode == 37) {
		if(direction != 'right') {
			direction = 'left'
		}
	} else if(keyCode == 39) {
		if(direction != 'left') {
			direction = 'right'
		}
	} else if(keyCode == 38) {
		if(direction != 'bottom') {
			direction = 'top'
		}
	} else if(keyCode == 40) {
		if(direction != 'top') {
			direction = 'bottom'
		}
	}
	if(keyCode == 65) {
		if(direction1 != 'right') {
			direction1 = 'left'
		}
	} else if(keyCode == 68) {
		if(direction1 != 'left') {
			direction1 = 'right'
		}
	} else if(keyCode == 87) {
		if(direction1 != 'bottom') {
			direction1 = 'top'
		}
	} else if(keyCode == 83) {
		if(direction1 != 'top') {
			direction1 = 'bottom'
		}
	}
	if(keyCode == 74) {
		if(direction2 != 'right') {
			direction2 = 'left'
		}
	} else if(keyCode == 76) {
		if(direction2 != 'left') {
			direction2 = 'right'
		}
	} else if(keyCode == 73) {
		if(direction2 != 'bottom') {
			direction2 = 'top'
		}
	} else if(keyCode == 75) {
		if(direction2 != 'top') {
			direction2 = 'bottom'
		}
	}
}



//响应键盘移动
function move_snake() {
			var x = 0,
				y = 0
			if(begin==0)
			{
				if(direction == 'right') {
				x = 20
				} else if(direction == 'left') {
					x = 900
				} else if(direction == 'top') {
					y = 620
				} else if(direction == 'bottom') {
					y = 20
				}
				for(var i = 0; i < snake_body.length - 1; i++) {
					snake_body[i].x = snake_body[i + 1].x
					snake_body[i].y = snake_body[i + 1].y
				}
				snake_body[snake_body.length - 1].x = (snake_body[snake_body.length - 1].x+x)%920
				snake_body[snake_body.length - 1].y = (snake_body[snake_body.length - 1].y+y)%640
			}
}
function move_snake1() {
			var x = 0,
				y = 0
			if(begin==0)
			{
				if(direction1 == 'right') {
				x = 20
				} else if(direction1 == 'left') {
					x = 900
				} else if(direction1 == 'top') {
					y = 620
				} else if(direction1 == 'bottom') {
					y = 20
				}
				for(var i = 0; i < snake_body1.length - 1; i++) {
					snake_body1[i].x = snake_body1[i + 1].x
					snake_body1[i].y = snake_body1[i + 1].y
				}
				snake_body1[snake_body1.length - 1].x = (snake_body1[snake_body1.length - 1].x+x)%920
				snake_body1[snake_body1.length - 1].y = (snake_body1[snake_body1.length - 1].y+y)%640
			}
}
function move_snake2() {
			var x = 0,
				y = 0
			if(begin==0)
			{
				if(direction2 == 'right') {
				x = 20
				} else if(direction2 == 'left') {
					x = 900
				} else if(direction2 == 'top') {
					y = 620
				} else if(direction2 == 'bottom') {
					y = 20
				}
				for(var i = 0; i < snake_body2.length - 1; i++) {
					snake_body2[i].x = snake_body2[i + 1].x
					snake_body2[i].y = snake_body2[i + 1].y
				}
				snake_body2[snake_body2.length - 1].x = (snake_body2[snake_body2.length - 1].x+x)%920
				snake_body2[snake_body2.length - 1].y = (snake_body2[snake_body2.length - 1].y+y)%640
			}
}

// 食物随机出现
function random_food() {
			food_position = {
				x: ~~(Math.random() * (920 / 20)) * 20,
				y: ~~(Math.random() * (640 / 20)) * 20
			}
			fillarray();
}
//位置数组填充
function fillarray()
{
	for(var i=0;i<46;i++)
	{
		for(var j=0;j<32;j++)
		{
			location[i][j]=0;
		}
	}
	for(var k=0;k<snake_body.length;k++)
	{
		location[(snake_body[k].x/20)][(snake_body[k].y/20)]=1;
	}
	for(var k=0;k<snake_body1.length;k++)
	{
		location[(snake_body1[k].x/20)][(snake_body1[k].y/20)]=2;
	}
	for(var k=0;k<snake_body2.length;k++)
	{
		location[(snake_body2[k].x/20)][(snake_body2[k].y/20)]=4;
	}
	location[(food_position.x/20)][(food_position.y/20)]=3;
	data = location
		}
		// 吃食物
function eat_food() {
			if(snake_body[snake_body.length - 1].x == food_position.x && snake_body[snake_body.length - 1].y == food_position.y) {
				random_food()
				add_snake_fastival()
				player1=player1+1
			}
}
function eat_food1() {
			if(snake_body1[snake_body1.length - 1].x == food_position.x && snake_body1[snake_body1.length - 1].y == food_position.y) {
				random_food()
				add_snake1_fastival()
				player2=player2+1
			}
}
function eat_food2() {
			if(snake_body2[snake_body2.length - 1].x == food_position.x && snake_body2[snake_body2.length - 1].y == food_position.y) {
				random_food()
				add_snake2_fastival()
				player3=player3+1
			}
}
// 吃食物后蛇身增加
function add_snake_fastival() {
			new_fastival = {
				x: snake_body[0].x - 20,
				y: snake_body[0].y - 20,
			}

			snake_body.unshift(new_fastival)
}
function add_snake1_fastival() {
			new_fastival = {
				x: snake_body1[0].x - 20,
				y: snake_body1[0].y - 20,
			}
			snake_body1.unshift(new_fastival)
}
function add_snake2_fastival() {
			new_fastival = {
				x: snake_body2[0].x - 20,
				y: snake_body2[0].y - 20,
			}
			snake_body2.unshift(new_fastival)
}
//判死
function dead() {
	var last_fastival = snake_body[snake_body.length - 1]
	if(last_fastival.x == -20 || last_fastival.x == 920 || last_fastival.y == -20 || last_fastival.y == 640) {
		
	}
	if(player1>=10)
	{
		
	}
}

function dead1() {
	var last_fastival = snake_body1[snake_body.length - 1]
	if(last_fastival.x == -20 || last_fastival.x == 920 || last_fastival.y == -20 || last_fastival.y == 640) {
		
	}
	if(player2>=10)
	{
		
	}
}
function startGame(){
//启动定时器
		var set1 = setInterval(fn,speed);
    	for(var i=0;i<46;i++){        //46行
            for(var j=0;j<32;j++){    //32列
                data[i][j] = 0;
            }
    	}
		for(var i=0;i<46;i++){
			for(var j=0;j<32;j++){
				location[i][j]=0;
			}
		}
		function fn(){
			clearInterval(set1);
			if(option==0)
			{
				set1 = setInterval(fn, speed-player1*Math.pow(2,5-level));
				eat_food2();
				move_snake2();
				eat_food();
				move_snake();
				eat_food1();
				move_snake1();
				fillarray();
				io.emit('update',{"data":data,"score1":player1,"score2":player2,"score3":player3,"gamer1":users[0].name,"gamer2":users[1].name,"gamer3":users[2].name});
				if(player1==3){
					clearInterval(set1);
				    fs.appendFileSync("results.txt", "winner is:"+users[0].name+"\n");
				}
				else if(player2==3){
					clearInterval(set1);
				    fs.appendFileSync("results.txt", "winner is:"+users[1].name+"\n");
				}
				else if(player3==3){
					clearInterval(set1);
				    fs.appendFileSync("results.txt", "winner is:"+users[2].name+"\n");
				}
			}
		}
		
}		
//引入socket.io库




app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "register.html" );
});
//接收 POST 请求
app.post("/register",urlencodedParser, function(req, res)
	{
		var username = req.body.username;
		var pwd1 = req.body.password1;
		var pwd2 = req.body.password2;
	    var pwd1hash = SHA256(pwd1).toString();
	    var pwd2hash = SHA256(pwd2).toString();
		console.log("Register:", username, pwd1,pwd2,pwd1hash,pwd2hash);
		if(pwd1hash==pwd2hash){
		//连接数据库，查询是否已注册C:\Users\88\Desktop\MyChart\debug\Server\Data\Database
		var db = new sqlite3.Database('C:/Users/chen/Desktop/MyChart1/release/Server/Data/Database/info.db');
		db.get("SELECT id FROM USERINFO WHERE username = ?", [username], function(err, row)
			{
				if(row!=undefined)
				{
					res.send(" 用户已注册");
				} 
				else 
				{
					db.serialize(function()
						{
						//向数据库写入注册信息
						db.run("INSERT INTO USERINFO (id,name, passwd) VALUES (?,?,?)", [Math.round(Math.random()*100)+100,username, pwd1]);
						}
					)
					res.redirect("/login");
				}
				db.close();
			}
		);
		}
	}
);

/*

//添加 session 中间件
app.use(session({
secret: 'dev',
resave: false,
saveUninitialized: true,
cookie: { maxAge: 30*24*60*1000 } //30 天免登陆
}));
*/
app.get("/", function(req, res){
	if(req.session.username){
	//已建立会话用户直接进入 home 页面
	res.render("home.html", {username: req.session.username});
	} else {
	//重定向到登录页面
	res.redirect("login");
	}
	});

app.get("/logout", function(req, res){
	//退出清除 session
	req.session.username = null;
	res.redirect("login");
});
app.get('/login', function (req, res) {
   res.sendFile( __dirname + "/" + "login.html" );
});
app.post("/login",urlencodedParser, function(req, res){
	var username = req.body.username;
	var pwd = req.body.password;
	var pwdhash = SHA256(pwd).toString();
	var validCode1=req.body.validCode1.toLowerCase();
	var validCode2=req.body.validCode2.toLowerCase();
	console.log("Login: ", username, pwd,pwdhash);
	var db = new sqlite3.Database('C:/Users/chen/Desktop/MyChart1/release/Server/Data/Database/info.db');
	db.get("SELECT password FROM USERINFO WHERE username = ?", [username], function(err, row){
	//console.log(err, row);
	if(validCode1!=validCode2){
	res.send("验证码错误");
	}
	else if(row==undefined){
	res.send(" 用户名错误");
	} else if (row.password != pwd) {
	res.send(" 密码错误");
	} else {
	//登录成功建立会话
	req.session.username = username;
	res.redirect("/");
	}
	db.close();
	});
});
var userNum = 0;
var users=[];
io.on('connection', function(socket) {
	console.log(socket.request.session.username);
	socket.on('ready', function(data){
		if(data.str=='pause')
		{
			console.log("pause");
			option=1;
			startGame();
		}
		else if(data.str=="continue")
		{
			console.log("continue");
			option=0;
			startGame();
		}
		else{
			console.log(socket.request.session.username+" is "+data.str,userNum);
			if(userNum%3==0)
				users.push({
					id:socket.id,
					name: socket.request.session.username,
					socket: socket,
					score: 0,
					press_dir: "R",
					now_dir: "R",
					snake: player1});
			if(userNum%3==1)
				users.push({
					id:socket.id,
					name: socket.request.session.username,
					socket: socket,
					score: 0,
					press_dir: "R",
					now_dir: "R",
					snake: player2});
			if(userNum%3==2)
				users.push({
					id:socket.id,
					name: socket.request.session.username,
					socket: socket,
					score: 0,
					press_dir: "R",
					now_dir: "R",
					snake: player3});
			userNum++;
			if(userNum%3==0){
				init_snake()
				init_snake1()
				init_snake2()
				player1=0;
				player2=0;
				player3=0;
				option=0;
				startGame();
			}
		}
	});
	socket.on('change direction', function(data) {
			changeDirection(data.key);
	})
});
var server1 = http.listen(8082, function () {
  var host = server1.address().address
  var port = server1.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})