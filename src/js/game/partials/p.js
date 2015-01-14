var p = {

	setup: function(game){

		game.avatar = [];

		game.nextShotAt = [];
		game.shotDelay = [];

		game.nextKillAt = [];
		game.KillDelay = [];

		game.now_invincible = [];

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
			p.player_game_avatar_setup(i, game);
			p.fire_setup(game, i);
			p.invincible_setup(game, i);
			game.now_invincible[i] = 0;
		}
		game.players.setAll('anchor.x', 0.5);
		game.players.setAll('anchor.y', 0.5);
		game.players.setAll('health', 10);

		//calculate groups health
		game.starting_players_health = p.check_players_health(game, game.players);

	},

	check_players_health: function(game, players){
		game.current_players_health = 0;
		game.players.forEachAlive( p.check_player_health, this, game);
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

	player_game_avatar_setup: function(num, game){
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

module.exports = p;
