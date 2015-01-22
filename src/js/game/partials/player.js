var sfx = require('sfx');
var player = {

	setup: function(game){

		//game.avatar = [];

		game.nextShotAt = [];
		game.shotDelay = [];

		game.nextKillAt = [];
		game.KillDelay = [];

		var healthbar = require('healthbar');
		game.healthbars = game.add.group();

		var powerbar = require('powerbar');
		game.powerbars = game.add.group();

		//bullet pool could be individual
		game.bulletPool = game.add.group();
		game.bulletPool.enableBody = true;
		game.bulletPool.physicsBodyType = Phaser.Physics.ARCADE
		game.bulletPool.createMultiple(10*game.num_players, 'bullet'); //needs to be based on amount of players
		game.bulletPool.setAll('anchor.x', 0.5);
		game.bulletPool.setAll('anchor.y', 0.5);
		game.bulletPool.setAll('outOfBoundsKill', true);
		game.bulletPool.setAll('checkWorldBounds', true);

		var avatar = require('avatar');
		game.player_starting_health = 11;
		// player setup move this out to function
		game.players = game.add.group();

		for (i = 0; i < game.num_players; i++) {

			var p = game.players.getFirstDead();
			if (p === null) {
				p = new avatar(game, i);
			}

			var h = game.healthbars.getFirstDead();
			if (h === null) {
				h = new healthbar(game, i);
			}

			var s = game.powerbars.getFirstDead();
			if (s === null) {
				s = new powerbar(game, i);
			}
		}

		//calculate groups health
		game.starting_players_health = game.player_starting_health*game.num_players;
		
	},

	pickedup: function(p, what){

		if(what.class == 0){
			player.add_health(p, what);
		}else{
			player.revive_player(p, what);
		}
	},

	revive_player: function(player, lives){
		lives.kill();
		game = player.game;
		if(game.players.countLiving() == game.num_players){
			return;
		}else{
			dead_player = game.players.getFirstDead();
			dead_player.x = lives.x;
			dead_player.y = lives.y;
			dead_player.revive(game.starting_players_health/2);
		}
	},

	add_health: function(player, health) {
		game = player.game;
		health.kill();
		if(player.health < game.starting_players_health){
			player.damage(-1);
		}
	},

	health_visual_value: function(game, player_id){
		this_player = game.players.getAt(player_id);
		health_section = 360/game.player_starting_health;
		display_health = this_player.health*health_section;
		return game.math.degToRad(display_health+90);
	},

	check_players_health: function(game, players){
		game.current_players_health = 0;
		game.players.forEachAlive( player.check_player_health, this, game);
		return game.current_players_health;
	},

	check_player_health: function(player, game){
		game.current_players_health =  game.current_players_health+player.health;
	},

	collision_notice: function(player, enemy) {
		game = player.game;
		if (game.nextKillAt[player.name] > game.time.now) {
			return;
		}
		game.nextKillAt[player.name] = game.time.now + game.KillDelay[player.name];
		game.players.getAt(player.name).alpha = 0.2;
		player.damage(1);
		enemy.damage(1);
		sfx.shake(game);
	},

	ricochet: function(bullet, player){
		//this does not work quite right
		bullet.body.velocity.x *= -1;
		bullet.body.velocity.y *= -1;
	}

};

module.exports = player;
