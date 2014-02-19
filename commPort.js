////////////////////////////////////////////////////////
// Use the cool library                               //
// git://github.com/voodootikigod/node-serialport.git //
// to read the serial port where arduino is sitting.  //
////////////////////////////////////////////////////////               
var com = require("serialport");
//var net = require("net");

var beltPort = new com.SerialPort("/dev/tty.NavUnit-1-SPP", {
    baudrate: 19200,
    parser: com.parsers.readline('\r\n')
  });
beltPort.on('open',function() {
  console.log('Belt Port open');
});

  
var WebSocketServer = require('ws').Server
, ws = new WebSocketServer({port: 8880});

  ws.on('connection', function(ws) {
  		console.log("websocket open");
		ws.on('message', function(message) {
			console.log('received: %s', message);
			beltPort.write(message);
		});
		ws.on('close', function(){
			console.log("Socket Closed")
		});
		beltPort.on('data', function(data) {
			console.log(data);
			//console.log(ws.readyState);
			if(ws.readyState === 1) {
				ws.send(data);
			}
		});
	});

