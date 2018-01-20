var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io');
var io = socketio().listen(server);

var mongoose = require("mongoose")
var MongoClient = require('mongodb').MongoClient;
var db
var clients = {};
var isequal = true;

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
	console.log("listening in http://localhost:"+port);
})