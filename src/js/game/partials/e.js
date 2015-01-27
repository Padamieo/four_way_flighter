var sfx = require('sfx');

var e = {

	setup: function(game){
		//setup the enemies group
		game.enemies = game.add.group();
		//enemies.events.onKilled(function(){console.log("dead"+this.x+this.y)}, this);

		game.next_e_ShotAt = [];
		game.e_shotDelay = [];

		//bullet pool could be individual
		game.e_bulletPool = game.add.group();
		game.e_bulletPool.enableBody = true;
		game.e_bulletPool.physicsBodyType = Phaser.Physics.ARCADE
		game.e_bulletPool.createMultiple(100*game.num_players, 'bullet'); //needs to be based on amount of players
		game.e_bulletPool.setAll('anchor.x', 0.5);
		game.e_bulletPool.setAll('anchor.y', 0.5);
		game.e_bulletPool.setAll('outOfBoundsKill', true);
		game.e_bulletPool.setAll('checkWorldBounds', true);
	},

	fire: function(game, e, targetAngle){
		if (game.next_e_ShotAt[e.z] > game.time.now) {
			return;
		}
		game.next_e_ShotAt[e.z] = game.time.now + game.e_shotDelay[e.z];
		if (game.e_bulletPool.countDead() === 0) {
			return;
		}

		e_bullet = game.e_bulletPool.getFirstExists(false);
		e_bullet.reset(e.x, e.y, 'bullet');

		//e_bullet.body.animations.frame = 2; //needs to set bullet colour on who fired

		e_bullet.rotation = targetAngle;
		e_bullet.SPEED = 400;
		e_bullet.body.velocity.x = Math.cos(e_bullet.rotation) * e_bullet.SPEED;
		e_bullet.body.velocity.y = Math.sin(e_bullet.rotation) * e_bullet.SPEED;
	},

	explosion: function(game, loc){
		if (game.explosion.countDead() === 0) {
			return;
		}
		sfx.burst(game, loc.x, loc.y);
		bang = game.explosion.getFirstExists(false);
		//bang.rotation = 180;
		bang.reset(loc.x, loc.y);
		bang.play('boom', 30, 1, true);

	},

	random_alive_player: function(game){
		num_alive = game.players.countLiving();
		rnd_target = game.rnd.integerInRange(0, num_alive);
		return rnd_target;
	},

	choose_player_target: function(game, enemy, target){
		if(game.players.getAt(target).alive){
			x = game.players.getAt(target).x;
			y = game.players.getAt(target).y;
		/*
		//not sure if using player group or zord group
		}else if(player_combo.alive){
			x = player_combo.x;
			y = player_combo.y;
		*/
		}else{
			if(game.players.countDead() == game.num_players){
				rl = e.random_location(game);
				x = rl[0];
				y = rl[1];
			}else{
				rdn_target = e.random_alive_player(game);
				x = game.players.getAt(rdn_target).x;
				y = game.players.getAt(rdn_target).y;
				enemy.TARGET = rdn_target;
			}
		}
		x = Math.floor(x);
		y = Math.floor(y);
		var arr = new Array(x, y);
		return arr;
	},

	random_location: function(game){
		x = game.rnd.integerInRange(0, game.width);
		y = game.rnd.integerInRange(0, game.height);
		var arr = new Array(x, y);
		return arr;
	}

};

module.exports = e;
