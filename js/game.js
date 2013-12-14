/*
This is teh base game object taht contains all the game data..

*/
var game ={
	container:"game",
	version:"v 1",
	width: 800,
	height: 800,
	fontsize:16,
	font:"16px daniel, sans-serif",	
	up:0,
	down: Math.PI,
	left: Math.PI/2,
	right: Math.PI/2*3,
	score: 0,
	keys:{
		"left":37, 
		"right":39,
		"up":38,
		"down":40,
		"use":32
		
	},
	keysDown:{
		"left":false, 
		"right":false,
		"up":false,
		"down":false,
		"use":false
	},
	settings:{
		screen:"menu",
		level:"home",
		dataDirectory:"data",
		
	},
	progress:{
		"mall":false,
		"forest":false,
		"stadium":false
	},
	
	hearts:5,
	maxHearts:5,
	
	
	context:{
		back:false,
		main:false,
		vfx:false
	},
	setup:function(){
		document.getElementById(game.container).focus();
		game.objects.player = new game.objects.player();
			
	},
	events:{
		"click":function(evt){
			if(game.screens[game.settings.screen] &&
					game.screens[game.settings.screen].click){

				game.screens[game.settings.screen].click(evt);
			}
			else{
				game.context.vfx.fillText("No Scene: "+game.settings.screen, diesel.mouseX, diesel.mouseY);
				evt.preventDefault();
			}
		},
		"screenChange":function(event){
			var from = event.args[0], to = event.args[1], transition = event.args[2]|| false;
			console.log(from, to, transition);

			game.screens[from].close();
			if(transition){
				game.screens[transition].reset(from, to);
				game.screens[transition].open();
				game.settings.screen = transition;
			}
			else{
				game.screens[to].reset();
				game.screens[to].open();
				game.settings.screen = to;
			}
		
		},
		"keydown":function(event){
//			alert("key"+event.keyCode);
			if(game.screens[game.settings.screen] &&
					game.screens[game.settings.screen].keydown){
				game.screens[game.settings.screen].keydown(event);
			}
		},
		
		"keyup":function(event){
				if(game.screens[game.settings.screen] &&
					game.screens[game.settings.screen].keyup){
				game.screens[game.settings.screen].keyup(event);
			}

		},
		"collision":function(event){
			console.log("collision",event);
			game.objects.player.collideTimer = game.objects.player.collideImmuneTime;
			game.hearts--;
			if(game.hearts ==0){
					diesel.raiseEvent("changeScreen","level","endGame","levelChange");				
			}
			//TODO trigger sounds
			
			
		},
		"levelChange":function(event){
			var from = event.args[0], to = event.args[1], transition = event.args[2] || "levelChange";
			console.log("lvl",from, to, transition);
			
			game.screens.level.prev= from;
			game.settings.level =to;
			
			diesel.raiseEvent("screenChange","level","level",transition);

		
		}
		
	},

	objects:{
		//for 
	},
	screens:{
		// used to draw a screen
	},
	assets:{
		tiles:[],
		entities:{
			"forest":function(player){
				diesel.raiseEvent("levelChange",game.settings.level, "forest", null);
				game.progress.forest =true;
				
			},
			"mall":function(player){
				diesel.raiseEvent("levelChange",game.settings.level, "mall", null);
				game.progress.mall =true;
				
			},
			"stadium":function(player){
				diesel.raiseEvent("levelChange",game.settings.level, "stadium", null);
				game.progress.stadium =true;
				
			},
			"home":function(player){
					diesel.raiseEvent("levelChange",game.settings.level, "home", null);
					
					var done =true;
					for(key in game.progress){
						done = done && key;
					}
					
					if(done){
						console.log("You have been everywhere man");
						diesel.raiseEvent("changeScreen","level","endGame","levelChange");
					}
									
			}
		}
	},
	preload:[
		{"image":"logo.png"},	
		{"sprite":"tiles.png","size":[32,32],"keys":{},"frames":1},
		{"sprite":"ents.png","size":[32,32],"keys":{},"frames":4},
		{"sprite":"hearts.png","size":[64,64],"keys":{"full":0,"empty":1},"frames":4},
		{"sprite":"banana.png","size":[64,64],"keys":{"used":0,"active":1},"frames":4},
		{"sprite":"band.png","size":[64,64],"keys":{"used":0,"active":0},"frames":4},
		{"sprite":"fan.png","size":[64,64],"keys":{"active":0,"used":1},"frames":4}
		
	],
	util:{
		"getLevel":function(id){
			console.log("loading level", id);
			var lvl =diesel.ajax("level/"+id+".json");
			game.screens.level.current = JSON.parse(lvl);
			},
		
		"ignore":function(e){
			e.preventDefault();
		}
		
		
		
	},
	state:{
	
	}
};

