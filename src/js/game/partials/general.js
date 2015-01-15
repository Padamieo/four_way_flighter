var general = {

	setup: function(game){

		//this is the standard physics with phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Maintain aspect ratio
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.input.onDown.add(gofull, this);

		//this is not a great background but it will do for now
		game.stage.backgroundColor = '#28A3CA';

		//adding pickups
		game.pickups = game.add.group();
	}
	
};

module.exports = general;
