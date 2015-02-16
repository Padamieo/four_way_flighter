var e_basic = require('e_basic');
var e_follower = require('e_follower');
var e_fighter = require('e_fighter');
var e_light = require('e_light');
var e = require('e');
var e_boss = require('e_boss');

var p = require('player');
var megazord = require('megazord');
var c = require('controls');
var g = require('general');
var sfx = require('sfx');
var pickup = require('pickup');

var m = require('pause');
var k = require('kill');

var manage = {

	setup_level: function(game, level_name){

	},

	setup_update: function(game){
		//game.filter.update();

		//notice a player collecting a pickup
		game.physics.arcade.overlap(game.players, game.pickups, p.pickedup, null, this);

		//game.physics.arcade.overlap(game.players, game.enemies, p.collision_notice, null, this);
		game.physics.arcade.collide(game.players, game.enemies, p.collision_notice, null, this);

		//this is just for registering who shot what
		game.physics.arcade.overlap(game.bulletPool, game.enemies, p.add_point, null, this);

		//enemies hitting player
		game.physics.arcade.overlap(game.e_bulletPool, game.players, p.hit, null, this);

		//this is for a bit of fun players shoot move other players, may want to drop if resources are concern
		game.physics.arcade.overlap(game.bulletPool, game.players, p.ricochet, null, this);

		if((p.check_players_megazoid(game, game.players)) == game.num_players){
			//animation
			//calculate combined health
			var a_mega_zord = game.mega_zord.getFirstDead();
			if (a_mega_zord === null) {
				a_mega_zord = new megazord(game);
			}
			game.players.forEach( p.kill_players, this, true);
		}

		//if player bullets remove them please.
		game.bulletPool.forEachAlive(function(bullet){
		bulletspeed = Math.abs(bullet.body.velocity.y) + Math.abs(bullet.body.velocity.x);
		if( bulletspeed < 200){ bullet.kill(); }
		});

		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC)){ m.pause(game);}

		lose_condition();
	}

};

module.exports = manage;
