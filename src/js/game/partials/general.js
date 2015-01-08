var general = {

	setup: function(game){
		// Create a white rectangle that we'll use to represent the flash
		game.pause_background = game.add.graphics(0, 0);
		game.pause_background.beginFill(0x000000, 1);
		game.pause_background.drawRect(0, 0, game.width, game.height);
		game.pause_background.endFill();
		game.pause_background.alpha = 0;

		// Add a input listener that can help us return from being paused
		//game.input.onDown.add(unpause, self);
	}

};

module.exports = general;
