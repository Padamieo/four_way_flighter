var p = {

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
