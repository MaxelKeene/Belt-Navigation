var net = require('net');

var client = net.connect({port: 8080},
   function() { //'connect' listener
 console.log('client connected');
 setInterval(function(){
			client.write('t\r');
			client.write('l\r');
		},5000);
});
client.on('data', function(data) {
 console.log(data.toString());
});
client.on('end', function() {
 console.log('client disconnected');
});

