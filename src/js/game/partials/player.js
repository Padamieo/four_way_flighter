var player = {

	setup: function(game){

		game.avatar = [];

		game.nextShotAt = [];
		game.shotDelay = [];

		game.nextKillAt = [];
		game.KillDelay = [];

		game.now_invincible = [];

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

		// player setup move this out to function
		game.players = game.add.group();
		game.players.enableBody = true;
		game.players.physicsBodyType = Phaser.Physics.ARCADE;
		for (i = 0; i < game.num_players; i++) {
			player._game_avatar_setup(i, game);
			player.fire_setup(game, i);
			player.invincible_setup(game, i);
			game.now_invincible[i] = 0;

			var h = game.healthbars.getFirstDead();
			if (h === null) {
				h = new healthbar(game, i);
			}

			var s = game.powerbars.getFirstDead();
			if (s === null) {
				s = new powerbar(game, i);
			}
		}
		game.players.setAll('anchor.x', 0.5);
		game.players.setAll('anchor.y', 0.5);
		game.player_starting_health = 11;
		game.players.setAll('health', game.player_starting_health);

		//calculate groups health
		//game.starting_players_health = player.check_players_health(game, game.players);
		game.starting_players_health = game.player_starting_health*game.num_players;
		//player.test(game, 0);
	},

	pickedup: function(p, what){
		var test = what.class;
		if(what.class = 0){
			player.revive_player(p, what);
		}else{
			player.add_health(p, what);
		}
	},

	revive_player: function(player, lives){
		lives.kill();
		if(game.players.countLiving() == game.num_players){
			return;
		}else{
			dead_player = game.players.getFirstDead();
			//move to appropriate position
			dead_player.x = lives.x;
			dead_player.y = lives.y;
			dead_player.revive(10);
			//need to trigger temp invincible
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

	fire_setup: function(game, num){
		game.nextShotAt[num] = 0;
		game.shotDelay[num] = 50;
	},

	invincible_setup: function(game, num){
		game.nextKillAt[num] = 0;
		game.KillDelay[num] = 600;
	},

	_game_avatar_setup: function(num, game){
		h = (game.height/3);
		w = (game.width/game.num_players+2);
		if(num == 0){ w = (w/2)-5; }else{ w = w*num+(w/2)-5; }

		game.avatar[num] = game.players.create(w, h*2, 'dude');
		game.avatar[num].body.collideWorldBounds=true;
		game.avatar[num].name=num;
		game.avatar[num].energy = 0;
		//game.avatar[num].health(2);
		//game.avatar[num].body.bounce.y=0.2;

		game.avatar[num].body.immovable = false;
		//game.avatar[num].body.immovable = true;

		game.avatar[num].animations.frame = 0+num;

		//this is how we will control variouse screen resolutions
		game.avatar[num].scale.y = 1;
		game.avatar[num].scale.x = 1;
		// animations still usefull but not being used / set
		//game.avatar[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//game.avatar[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//game.avatar[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
	}

};

module.exports = player;
