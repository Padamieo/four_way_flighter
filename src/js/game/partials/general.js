var pickup = require('pickup');
var p = require('player');
var general = {

	setup: function(game){

		game.player_colours = ['0xff00ff','0xffff00','0x00ffff','0x0000ff','0xff0000']; //need to be varouse pallets assigned from main menu. example classic, normal

		//this is the standard physics with phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Maintain aspect ratio
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.input.onDown.add(gofull, this);

		//this is not a great background but it will do for now
		game.stage.backgroundColor = '#28A3CA';

		//adding pickups
		game.pickups = game.add.group();

	},

	add_pickup: function(game){
		//game = spawn.game;
		console.log("hello"+game);
		console.log("hello"+c.game);
		//health_threshold = (game.starting_players_health/4);
		current_health = p.check_players_health(game, game.players);

		//health
		if(current_health < (game.starting_players_health/4)){
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
