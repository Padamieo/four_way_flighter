var controls = {

	setup: function(game){

		game.input.gamepad.start();

		game.pad = [];

		for (i = 0; i < game.num_players; i++) {
			controls.pad_setup(game, i);
		}
		
	},

	pad_setup: function(game, num){

	//indicatorpos = (game.width)-(22);
	//indicator[num] = game.add.sprite(indicatorpos,(num*10), 'controller-indicator');
	//indicator[num].scale.x = indicator[num].scale.y = 1;
	//indicator[num].animations.frame = 1;

		// To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
		if(num == 0){
			game.pad[num] = game.input.gamepad.pad1;
		}
		if(num == 1){
			game.pad[num] = game.input.gamepad.pad2;
		}
		if(num == 2){
			game.pad[num] = game.input.gamepad.pad3;
		}
		if(num == 3){
			game.pad[num] = game.input.gamepad.pad4;
		}
	}

};

module.exports = controls;

/*
	function pad_connect_indicator(num){
		if(game.input.gamepad.supported && game.input.gamepad.active && game.pad[num].connected) {
			indicator[num].animations.frame = 0;
		} else {
			indicator[num].animations.frame = 1;
		}
	}
*/
