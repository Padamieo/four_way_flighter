var u = {

	setup: function(game){
		game.explosion = game.add.group();
		game.explosion.createMultiple(100, 'explosion');
		game.explosion.setAll('anchor.x', 0.5);
		game.explosion.setAll('anchor.y', 0.5);
		game.explosion.setAll('killOnComplete',true);
		game.explosion.callAll('animations.add', 'animations', 'boom', [0, 1, 3], 30, false); //http://www.html5gamedevs.com/topic/4384-callback-when-animation-complete/

		// Create a white rectangle that we'll use to represent the flash
		game.flash = game.add.graphics(0, 0);
		game.flash.beginFill(0xffffff, 1);
		game.flash.drawRect(0, 0, game.width, game.height);
		game.flash.endFill();
		game.flash.alpha = 0;

		// Make the world a bit bigger than the stage so we can shake the camera
		game.world.setBounds(-10, -10, game.width + 20, game.height + 20);
	},

	flash: function (game){
		game.flash.alpha = 1;
		game.add.tween(game.flash)
		.to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In)
		.start();
	},

	shake: function(game){
		game.camera.y = 0;
		game.add.tween(game.camera)
		.to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
		.start();
	}

};

module.exports = u;
