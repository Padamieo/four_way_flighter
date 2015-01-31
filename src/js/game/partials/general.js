var pickup = require('pickup');
var p = require('player');
var general = {

	setup: function(game){

		game.player_colours = ['0x0A4496','0xFFDF4D','0xFF2F2F','0xFD4094', '0x086F41','0x1F1F1F']; //need to be varouse pallets assigned from main menu. example classic, normal
		//game.player_colours = ['0xE96151','0x1A7F9B','0x9CB53F','0xEF4562','0xff0000'];

		//this is the standard physics with phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Maintain aspect ratio
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.input.onDown.add(gofull, this);

		//this is not a great background but it will do for now
		game.stage.backgroundColor = '#5B91A8';

		//adding pickups
		game.pickups = game.add.group();

	},

	add_pickup: function(game){
		//game = spawn.game;
		//console.log("hello"+game);
		//console.log("hello"+c.game);
		//health_threshold = (game.starting_group_health/4);
		current_health = p.check_players_health(game, game.players);

		//health
		if(current_health < (game.starting_group_health/4)){
			var item = game.pickups.getFirstDead();
			if (item === null) {
				item = new pickup(game, 0);
			}else{
				item.revive();
			}
		}

		//lives
		if(game.players.countLiving() != game.num_players){
			var item = game.pickups.getFirstDead();
			if (item === null) {
				item = new pickup(game, 1);
			}else{
				item.revive();
			}
		}

	}

};

module.exports = general;
