//Web

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

update();

function update(){
	ctx.canvas.width = window.innerWidth - 25;
	ctx.canvas.height = window.innerHeight - 25;
	
	var mapData = {nodes:[],connections:[]};
	var connectionStyle = {
		opacity:{},
		width:{}
	};
	connectionStyle.opacity.min = parseFloat(document.getElementById("minOpacity").value);
	if(isNaN(connectionStyle.opacity.min)){
		connectionStyle.opacity.min = 0.1;
	}
	connectionStyle.opacity.max = parseFloat(document.getElementById("maxOpacity").value);
	if(isNaN(connectionStyle.opacity.max)){
		connectionStyle.opacity.max = 0.5;
	}
	connectionStyle.width.min = parseFloat(document.getElementById("minWidth").value);
	if(isNaN(connectionStyle.width.min)){
		connectionStyle.width.min = 0.1;
	}
	connectionStyle.width.max = parseFloat(document.getElementById("maxWidth").value);
	if(isNaN(connectionStyle.width.max)){
		connectionStyle.width.max = 1;
	}
	
	var nodeNumber = parseInt(document.getElementById("nodeNumber").value);
	if(isNaN(nodeNumber)){
		nodeNumber = 5;
	}
	var connectionNumber = parseInt(document.getElementById("connectionNumber").value);
	if(isNaN(connectionNumber)){
		connectionNumber = 100;
	}
	var showMarkers = document.getElementById("showMarkers").checked;

	function generateRandom(min, max){
		return ((Math.random() * (max - min)) + min);
	}

	for(i=0;i<nodeNumber;i++){
		mapData.nodes.push({position:{x:0,y:0}});
		
		mapData.nodes[i].position.x = Math.floor(Math.random()*canvas.width);
		mapData.nodes[i].position.y = Math.floor(Math.random()*canvas.height);
	}
	for(i=0;i<connectionNumber;i++){
		mapData.connections.push({
			location:{
				source:Math.floor(Math.random()*mapData.nodes.length),
				destination:Math.floor(Math.random()*mapData.nodes.length)
			},
			position:{
				control:[
					{
						x:0,
						y:0
					},
					{
						x:0,
						y:0
					}
				]
			},
			displayStyle:{
				opacity:generateRandom(connectionStyle.opacity.min,connectionStyle.opacity.max),
				width:generateRandom(connectionStyle.width.min,connectionStyle.width.max)
			}
		});
		
		var random = [];
		for(j=0;j<4;j++){
			random.push(Math.random());
		}
		
		mapData.connections[i].position.control[0].x = Math.round((mapData.nodes[mapData.connections[i].location.source].position.x * (1-random[0])) + (mapData.nodes[mapData.connections[i].location.destination].position.x * random[0]));
		mapData.connections[i].position.control[0].y = Math.round((mapData.nodes[mapData.connections[i].location.source].position.y * (1-random[1])) + (mapData.nodes[mapData.connections[i].location.destination].position.y * random[1]));
		mapData.connections[i].position.control[1].x = Math.round((mapData.nodes[mapData.connections[i].location.source].position.x * random[2]) + (mapData.nodes[mapData.connections[i].location.destination].position.x * (1-random[2])));
		mapData.connections[i].position.control[1].y = Math.round((mapData.nodes[mapData.connections[i].location.source].position.y * random[3]) + (mapData.nodes[mapData.connections[i].location.destination].position.y * (1-random[3])));
	}

	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for(i=0;i<mapData.connections.length;i++){
		ctx.strokeStyle = "rgba(0,0,0,"+mapData.connections[i].displayStyle.opacity+")";
		ctx.lineWidth = mapData.connections[i].displayStyle.width;
		
		ctx.beginPath();
		ctx.moveTo(mapData.nodes[mapData.connections[i].location.source].position.x,mapData.nodes[mapData.connections[i].location.source].position.y);

		var control1X = mapData.connections[i].position.control[0].x;
		var control1Y = mapData.connections[i].position.control[0].y;
		var control2X = mapData.connections[i].position.control[1].x
		var control2Y = mapData.connections[i].position.control[1].y;
		var mainX = mapData.nodes[mapData.connections[i].location.destination].position.x;
		var mainY = mapData.nodes[mapData.connections[i].location.destination].position.y;
		
		ctx.bezierCurveTo(control1X,control1Y,control2X,control2Y,mainX,mainY);
		ctx.stroke();
		
		if(showMarkers == true){
			ctx.fillStyle = "rgba(0,"+Math.round(i*(255/mapData.connections.length/2)+150)+",0,1)";
			ctx.fillRect((control1X-1),(control1Y-1),2,2);
			ctx.fillStyle = "rgba(0,0,"+Math.round(i*(255/mapData.connections.length/2)+150)+",1)";
			ctx.fillRect((control2X-1),(control2Y-1),2,2);
		}
		
	}
	if(showMarkers == true){
		for(i=0;i<mapData.nodes.length;i++){
			ctx.fillStyle = "rgba("+Math.round(i*(255/mapData.nodes.length/2)+150)+",0,0,1)";
			ctx.fillRect((mapData.nodes[i].position.x-5),(mapData.nodes[i].position.y-5),10,10);
		}
	}
}