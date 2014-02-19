// WEBSOCKET SETUP
//opened = false;
//ws0 = null;
myLocation = null;
myTarget = null;
firstDraw = true;

function webSocketInit() {
	ws0 = new WebSocket('ws:localhost:8880');
	console.log(ws0);
	console.log("Websocket Initialized");
	ws0.onopen =  onSocket0Open;
	ws0.onmessage = onSocketMsg;
	ws0.onclose = onCloseMsg;

	function onSocket0Open() {
		console.log('websocket opened');
		//setInterval(function(){
			getBeltData();
		//},5000);
	}

	function onSocketMsg(evt) {
		var mapOptions = {
		    zoom: 18
		  };
		  // var map = new google.maps.Map(document.getElementById('map-canvas'),
		  //     mapOptions);
		console.log(evt.data);
		//console.log(evt);

		var ident = evt.data.split(',');
		//console.log(ident);

		if(ident[0] == "$h") {
			console.log("Heading is "+(ident[1]/10));
	      angle = ident[1];
			angleMarker.setIcon({
										path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
										fillColor: 'blue',
										fillOpacity: 0.8,
										scale: 3,
										strokeColor: 'lightblue',
										strokeWeight: 1,
										anchor: new google.maps.Point(0,6),
										rotation: angle/10
									});
			// startView.setPov({
			// 			      heading: angle/10,
			// 			      pitch: 0
			// 			    })
	      // setTimeout(function(){
	      // 	ws0.send('h\r');
	      // },1000);
	    }
	    if(ident[0] == "$a") {
	      activity = ident[1];
	      //displayActivity(activity);
	    }
	    if(ident[0] == "$l") {
	    	//console.log("Location is "+ident[1]+' '+ident[2]);
	      latitude = ident[1];
	      longitude = ident[2];
	      if(ident[1] == 0.0){
	      	console.log("Waiting for valid location")
	      }else{
	      	if(firstDraw === true){
		      myLocation = new google.maps.LatLng(latitude,longitude);
		      placeLocation(myLocation, map);
		      placeAngle(myLocation, map);
			  map.panTo(myLocation);
			  firstDraw = false;
			  loadStreetViews();
		  	}else{
		  		locationMarker.setPosition(new google.maps.LatLng(latitude,longitude));
		  		angleMarker.setPosition(new google.maps.LatLng(latitude,longitude));

		  	}
	  	  }
	    }
	    if(ident[0] == "$t") {
	    	//console.log("Target is "+ident[1]+' '+ident[2]);
	      targetLatitude = ident[1];
	      targetLongitude = ident[2];
	      myTarget = new google.maps.LatLng(targetLatitude,targetLongitude);
	   		placeTarget(myTarget, map);
	    }
	    if(ident[0] == "$n") {
	      targetAngle = ident[1];
	    }
	    if(ident[0] == "$d") {
	      distance = ident[1];
	    }
	    if(ident[0] == "$s") {
	      //targetSet = true;
	      console.log("TARGET SET!!!!!!!!!!!!!!!!!!!");
	      console.log(ident[1]+" : "+ident[2]+" - "+ident[3]);
	    }

	}
	function onCloseMsg() {
		console.log("Socket Closed")
	}

}
function getBeltData(){
	getBeltLocationStream();
	getBeltHeadingStream();
	getBeltTarget();
}
function getBeltHeading(){
	ws0.send('h\r');
}
function getBeltHeadingStream(){
	headingStream = setInterval(function(){
		ws0.send('h\r');
	},1000);
}
function getBeltLocation(){
	ws0.send('l\r');
}
function getBeltLocationStream(){
	locationStream = setInterval(function(){
		ws0.send('l\r');
	},5000);
}
function getBeltTarget(){
	ws0.send('t\r');
}
function setTarget(coords){
	console.log("killing streams");
	clearInterval(headingStream);
	clearInterval(locationStream);
	setTimeout(function(){
		console.log("Sending new Target");
		ws0.send('s,'+coords.lat().toString()+','+coords.lng().toString()+',0,*');
	},5000);
	setTimeout(function(){
		//getBeltLocationStream();
		//getBeltHeadingStream();
	},6000);
}
