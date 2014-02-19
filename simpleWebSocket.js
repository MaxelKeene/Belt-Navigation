var WebSocket = require('ws');
var ws = new WebSocket('ws:localhost:8080');
ws.on('open', function() {
	console.log("Websocket Open")
	setInterval(function(){
    ws.send('t\r');
    ws.send('l\r');
},5000);
});
ws.on('message', function(data, flags) {
	console.log(data.toString());
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
});