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

		//setup energy score info
		game.score = 0;
		game.scoreText;
		textpos = (game.width)-(game.width/2);
		game.scoreText = game.add.text(textpos, game.height-14, '0', { fontSize: '12px', fill: '#fff' });
		game.scoreText.anchor.x=0.5;
		game.scoreText.anchor.y=0.5;
		general.update_score(game, 0);

		cursors = game.input.keyboard.createCursorKeys();

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
	},

	update_score: function(game, new_score){
		game.score = game.score + new_score;
		game.scoreText.text = '' + game.score + '';
	}

};

module.exports = general;
