var c = require('controls');
var something = require('something');
var m = require('pause');
var general = require('general');

module.exports = function(game) {

	var menu = {};

	menu.preload = function () {

		//need to sort out general later, its not really used.
		general.setup(game);

		c.setup(game); //setup controllers and keyboard
		//this does not work as no know number of players exists

		m.setup(game);	//modal screen setups ie pause and popups

		game.characters = game.add.group();

		for (i = 0; i < 5; i++) {
			//switch_button(i);
			//c.pad_setup(game, i);
			//controller_indicator(i);
			//test(i);

			var pc = game.characters.getFirstDead();
			if (pc === null) {
				pc = new something(game, 0, 0, i);
			}

		}

		game.start = game.add.sprite(game.world.width/2, game.world.height/4, 'switch');
		game.start.animations.frame = 0;
		game.start.anchor.setTo(0.5, 0.5);
		game.start.inputEnabled = true;
		game.start.scale.y = 3;
		game.start.scale.x = 3;

		game.stage.backgroundColor = '#565756';

		//game.oddarr = [0,1,2,3];

	};

	function check(player, i){
		if(player.assigned == 'N'){
			player.assigned = i;

		}
		//game.current_players_health =  game.current_players_health+player.health;
	};

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

	function cal(char, game){
		game.controls.push(char.assigned);
		game.selected_colour.push(char.selected_colour);
	};

	//calculations for starting a game
	function begin(){

		//game.controls = ['0','1','2','3','K'];
		game.controls = [];

		//game.selected_colour = ['0','2','1','3','4'];
		game.selected_colour = [];

		game.characters.forEachAlive( cal, this, game);

		game.num_players = game.characters.countLiving();

		if(game.num_players != 0){
			game.state.start('level');
		}
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
		//constantly_checking_for_pads();
		game.start.events.onInputDown.add(begin, game.start);
		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC)){ m.pause(game);}
	};

	menu.create = function () {

	};

	return menu;
};
