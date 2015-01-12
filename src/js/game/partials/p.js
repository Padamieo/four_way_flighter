var p = {

	setup: function(game){

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

	},

	check_health: function(player){
		g = this.game; //this is probably pretty lazy and abstract?
		check_h = player.health;
		g.cal_health = g.cal_health+check_h;
	},

	fire_setup: function(game, num){
		game.nextShotAt[num] = 0;
		game.shotDelay[num] = 50;
	},

	invincible_setup: function(game, num){
		game.nextKillAt[num] = 0;
		game.KillDelay[num] = 600;
	}

};

module.exports = p;
