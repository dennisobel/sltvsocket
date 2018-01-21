var app = require('express')();
//var app = express();
var server = require('http').createServer(app);
 var socketio = require('socket.io');
 var io = socketio().listen(server);
// var mongoose = require("mongoose")
// var MongoClient = require('mongodb').MongoClient;

//var port = process.env.PORT || 8000;

//var server = app.listen(cross.NormalizePort(port))
// var io = require("socket.io").listen(server,{
// 	log: false,
// 	agent: false,
// 	origins:"*:*",
// 	transports:['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
// });


var db
var clients = {};
var isequal = true;
var cors = require('cors');

app.use(cors());
app.use(function(req,res,next){
    var allowedOrigins = ["http://localhost:8100","http://localhost:8101","https://sltvsocket.herokuapp.com/","http://localhost:8080/cart/createcart","http://localhost:8080/cart/getcart",'http://localhost:8080/api/auth/protected','http://localhost:8080/api/auth/register','http://localhost:8080/api/auth/login'];
    var origin = req.headers.origin;
    // if(allowedOrigins.indexOf(origin) > -1){
    //     res.setHeader("Access-Control-Allow-Origin", origin);
    // }
    res.header("Access-Control-Allow-Origin", origin)
	//res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");    
	res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET, PATCH");    
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.header("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
})


//var allowedOrigins = ["http://localhost:8100","http://localhost:8101","https://sltvsocket.herokuapp.com/"];
io.origins(["http://localhost:8100","http://localhost:8101","https://sltvsocket.herokuapp.com/"])

io.on('connection',function(socket){
	socket.emit("connected",clients)
	
	//console.log(clients)
	console.log("a new client has connected with the id " + socket.id + "!");

	socket.on("getconnectedusers",()=>{
		io.emit("emitconnectedusers",clients)
	})

	socket.on("add_user",(data)=>{		
		clients[data.username]	={
			"socket":socket.id
		};			
		//console.log(clients)
		// io.emit("connected",clients)
	});

	socket.on("add-cart",(cart)=>{	
		io.emit("live",clients)
		console.log(cart.socket)
		for(key in clients){	
			this.isequal = cart.socket == clients[key].socket
			console.log(this.isequal)
		}
		if(isequal == true){	
			console.log("about to emit data to companion...")
			io.sockets.connected[cart.socket].emit("new_order",cart,()=>{
				console.log("emitting data to companion")
			})
		}else{
			console.log("do na'en")
		}
	});

	// socket.on('end', function (){
 //    	io.disconnect(0);
	// });

	socket.on("disconnect",()=>{
		io.emit("users-changed",{user: socket.nickname, event: "left"});		
	});
})



server.listen(process.env.PORT || 5000,function(){
	console.log(process.env.PORT);
})


/*

var server = require("http").createServer(onRequest);
var io = require("socket.io")(server);

function onRequest(req,res){
	res.writeHead(200, {
	'Access-Control-Allow-Origin' : 'http://localhost/'
	});
};

io.on('connection',function(socket){
	socket.emit("connected",clients)
	
	//console.log(clients)
	console.log("a new client has connected with the id " + socket.id + "!");

	socket.on("getconnectedusers",()=>{
		io.emit("emitconnectedusers",clients)
	})

	socket.on("add_user",(data)=>{		
		clients[data.username]	={
			"socket":socket.id
		};			
		//console.log(clients)
		// io.emit("connected",clients)
	});

	socket.on("add-cart",(cart)=>{	
		io.emit("live",clients)
		console.log(cart.socket)
		for(key in clients){	
			this.isequal = cart.socket == clients[key].socket
			console.log(this.isequal)
		}
		if(isequal == true){	
			console.log("about to emit data to companion...")
			io.sockets.connected[cart.socket].emit("new_order",cart,()=>{
				console.log("emitting data to companion")
			})
		}else{
			console.log("do na'en")
		}
	});

	// socket.on('end', function (){
 //    	io.disconnect(0);
	// });

	socket.on("disconnect",()=>{
		io.emit("users-changed",{user: socket.nickname, event: "left"});		
	});
})

var port = process.env.PORT || 8000;

server.listen(port,function(){
	console.log("listening in http://localhost:" + port);
})

*/