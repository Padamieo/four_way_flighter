module.exports = function(game) {

	var menu = {};
	var button = [];
	var indicator = [];
	
	menu.preload = function () {
		//game.num_players = 1;
		
		for (i = 0; i < 4; i++) {
			switch_button(i);
			controller_indicator(i);
		}
		
		game.start = game.add.sprite(game.world.width/2, game.world.height/4, 'switch');
		game.start.animations.frame = 0;
		game.start.anchor.setTo(0.5, 0.5);
		game.start.inputEnabled = true;
		game.start.scale.y = 3;
		game.start.scale.x = 3;
		
		game.stage.backgroundColor = '#565756';
	};
	
	//I think this works
	function pad_connect_indicator(num){
		if(num == 4){
			return;
		}else{
			if(game.input.gamepad.supported && game.input.gamepad.active && pad[num].connected) {
				indicator[num].animations.frame = 1;
			} else {
				indicator[num].animations.frame = 0;
			}
		}
	}
	
	//this needs changing
	function controller_indicator(num){
		posy = (game.stage.bounds.height/2.8);
		posx = (game.stage.bounds.width/4);
		if(num == 0){ posx = (posx/2)-5; }else{ posx = posx*num+(posx/2)-5; }
		indicator[num] = game.add.sprite(posx, posy*2, 'controllers');
		if(num == 0){
			indicator[num].animations.frame = 3;
		}else{
			indicator[num].animations.frame = 0;
		}
		indicator[num].anchor.setTo(0.5, 0.5);
		indicator[num].inputEnabled = true;
	}

	function switch_button(num){
		posy = (game.stage.bounds.height/4);
		posx = (game.stage.bounds.width/4);
		if(num == 0){ posx = (posx/2)-5; }else{ posx = posx*num+(posx/2)-5; }
		button[num] = game.add.sprite(posx, posy*2, 'switch');
		if(num == 0){
			button[num].animations.frame = 2;
		}else{
			button[num].animations.frame = 0;
		}
		button[num].anchor.setTo(0.5, 0.5);
		button[num].inputEnabled = true;
	}

	function actionOnClick () {
		if(this.z == 1){
			if( this.animations.frame == 1){
				this.animations.frame = 2;
				indicator[this.z-1].animations.frame = 3;
			}else if( this.animations.frame == 2){
				this.animations.frame = 1;
				indicator[this.z-1].animations.frame = 0;
			}
		}else{
			if( this.animations.frame == 0){
				this.animations.frame = 1;
			}else if( this.animations.frame == 1){
				this.animations.frame = 0;
			}
		}
	}

	function begin(){
		//count frames determine players
		store = 0;
		for (i = 0; i < 4; i++) {
			count = button[i].animations.frame;
			store = store + count;
		}
		
		if(button[0].animations.frame == 2){
			game.keyboard_offset = 1;
			store = store-1;
		}else{
			game.keyboard_offset = 0;
		}
		console.log("keyboard"+game.keyboard_offset);
		
		if(store == 5){
			game.num_players = 4;
		}else{
			game.num_players = store;
		}
		console.log("players"+game.num_players);
		
		game.state.start('game');
	}

	function start_game(){
		game.state.start('game');
	}
	
	menu.update = function (){
		for (i = 0; i < 4; i++) {
			button[i].events.onInputDown.add(actionOnClick, button[i]);
			pad_connect_indicator(i);
		}
		game.start.events.onInputDown.add(begin, game.start);

	};

	menu.create = function () {
			
	};
	
	return menu;
};
