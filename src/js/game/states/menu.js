var c = require('controls');
module.exports = function(game) {

	var menu = {};

	menu.preload = function () {

		c.setup(game);
		/*
		for (i = 0; i < 4; i++) {
			switch_button(i);
			c.pad_setup(game, i);
			controller_indicator(i);
			test(i);
		}
		*/

		game.start = game.add.sprite(game.world.width/2, game.world.height/4, 'switch');
		game.start.animations.frame = 0;
		game.start.anchor.setTo(0.5, 0.5);
		game.start.inputEnabled = true;
		game.start.scale.y = 3;
		game.start.scale.x = 3;

		game.stage.backgroundColor = '#565756';

	};

	//add currently active pads up
	function pad_connect_indicator(num){
		if(game.input.gamepad.supported && game.input.gamepad.active && game.pad[num].connected) {
			count = count+1;
		}else{
			count = count+0;
		}
	}

	/*
	//set-up default indicators
	function controller_indicator(num){
		posy = (game.height/2.8);
		posx = (game.width/4);
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

	//define button switches
	function switch_button(num){
		posy = (game.height/4);
		posx = (game.width/4);
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

	//button action
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
	*/

	//calculations for starting a game
	function begin(){

		game.controls = ['K','1','2','3'];

		game.num_players = 1;

		game.state.start('level');
	}

	//start it now not used
	function start_game(){
		game.state.start('level');
	}

	//update loop
	menu.update = function (){
		/*
		count = 0;
		for (i = 0; i < 4; i++) {
			button[i].events.onInputDown.add(actionOnClick, button[i]);
			pad_connect_indicator(i);
		}
		*/
		game.start.events.onInputDown.add(begin, game.start);

	};

	menu.create = function () {

	};

	return menu;
};
