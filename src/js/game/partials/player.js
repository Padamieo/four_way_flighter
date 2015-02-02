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
		game.bulletPool.createMultiple(100*game.num_players, 'bullet'); //needs to be based on amount of players
		game.bulletPool.setAll('anchor.x', 0.5);
		game.bulletPool.setAll('anchor.y', 0.5);
		game.bulletPool.setAll('outOfBoundsKill', true);
		game.bulletPool.setAll('checkWorldBounds', true);

		var avatar = require('avatar');
		game.player_starting_health = 11; //this could be array for individuals
		game.MAX_ENERGY = 10;
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

		var megazord = require('megazord');
		game.mega_zord = game.add.group();
		// var a_mega_zord = game.mega_zord.getFirstDead();
		// if (a_mega_zord === null) {
		// 	a_mega_zord = new megazord(game);
		// }

		//setup energy score info
		game.score = 0;
		game.scoreText;
		game.scoreText = game.add.text(game.width, game.height, '', { fontSize: '200px', fill: '#fff', font: '200px d' });
		game.scoreText.alpha = 0.3;
		game.scoreText.anchor.x=1;
		game.scoreText.anchor.y=0.9;

		player.update_score(game, 0);

		//calculate groups health
		game.starting_group_health = game.player_starting_health*game.num_players;

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
			dead_player.revive(game.player_starting_health/2);
		}
	},

	add_health: function(player, health) {
		game = player.game;
		health.kill();
		if(player.health < game.starting_group_health){
			value = game.player_starting_health/5
			player.damage(-value);
		}
	},

	health_visual_value: function(game, player_id){
		this_player = game.players.getAt(player_id);
		health_section = 360/game.player_starting_health;
		display_health = this_player.health*health_section;
		return game.math.degToRad(display_health+90);
	},

	energy_visual_value: function(game, player_id){
		this_player = game.players.getAt(player_id);
		energy_section = 360/game.MAX_ENERGY;
		display_energy = this_player.energy*energy_section;
		return game.math.degToRad(display_energy+90);
	},

	check_players_health: function(game, players){
		game.current_players_health = 0;
		game.players.forEachAlive( player.check_player_health, this, game);
		return game.current_players_health;
	},

	check_player_health: function(player, game){
		game.current_players_health =  game.current_players_health+player.health;
	},

	check_players_megazoid: function(game, players){
		game.zoid = 0;
		game.players.forEachAlive( player.zoid_request, this, game);
		return game.zoid;
	},

	zoid_request: function(player, game){
		game.zoid =  game.zoid+player.zoid_request;
	},

	collision_notice: function(player, enemy) {
		game = player.game;
		if (game.nextKillAt[player.name] > game.time.now) {
			return;
		}
		game.nextKillAt[player.name] = game.time.now + game.KillDelay[player.name];
		game.players.getAt(player.name).alpha = 0.2;
		game.players.getAt(player.name).show_health = 1;
		player.damage(1);
		enemy.damage(1);//should be based on players bullet damage
		sfx.shake(game);
	},

	ricochet: function(bullet, player){
		//this if statement did nothing
		if(bullet.name != player.name){
			//this does not work quite right
			bullet.body.velocity.x *= -1;
			bullet.body.velocity.y *= -1;
		}
	},

	update_energy: function(game, i){
		energy = game.players.getAt(i).energy;
		if(energy >= game.MAX_ENERGY){
			return;
		}
		game.players.getAt(i).energy = energy+1;
		//game.players.getAt(i).show_energy = 1;
	},

	add_point: function(bullet, enemy){
		//I think this is a player function
		game = enemy.game;
		x = bullet.x;
		y = bullet.y;
		bullet.kill();
		sfx.ping(game, x, y);
		enemy.damage(1);
		if(enemy.health <= 0){
			player.update_energy(game, bullet.name);
			player.update_score(game, enemy.kill_point);
		}
	},

	hit: function(bullet, player){
		game = player.game;
		bullet.kill();
		/*
		if (game.nextKillAt[player.name] > game.time.now) {
			return;
		}
		game.nextKillAt[player.name] = game.time.now + game.KillDelay[player.name];
		game.players.getAt(player.name).alpha = 0.2;
		*/
		game.players.getAt(player.name).show_health = 1;
		player.damage(1);

		//sfx.shake(game); // this might be a little too much
		sfx.smoke(game, player.x, player.y);
	},

	update_score: function(game, new_score){
		game.score = game.score + new_score;
		game.scoreText.text = '' + game.score + '';
	},

	kill_players: function(player) {
		player.kill();
	}

};

module.exports = player;
