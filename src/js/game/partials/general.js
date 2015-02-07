var general = {

	setup: function(game){

		game.player_colours = ['0x0A4496','0xFFDF4D','0xFF2F2F','0xFD4094', '0x086F41','0x1F1F1F']; //need to be varouse pallets assigned from main menu. example classic, normal
		//game.player_colours = ['0xE96151','0x1A7F9B','0x9CB53F','0xEF4562','0xff0000'];

		//this is the standard physics with phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Maintain aspect ratio
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.input.onDown.add(gofull, this);

	}

};

module.exports = general;
