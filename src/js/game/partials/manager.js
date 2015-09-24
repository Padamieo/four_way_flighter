var e_basic = require('e_basic');
var e_follower = require('e_follower');
var e_fighter = require('e_fighter');
var e_light = require('e_light');
var e_func = require('e');
var e_boss = require('e_boss');

var p = require('player');
var megazord = require('megazord');
var c = require('controls');
var g = require('general');
var sfx = require('sfx');
var pickup = require('pickup');

var m = require('pause');
//var k = require('kill');

var manage = {

	setup_level: function(game, level_name, colour){

		game.count_rounds = 0;
		game.stage.backgroundColor = colour;

		//general setups
		g.setup(game);

		//enemies setup
		e_func.setup(game); //dont know why but this breaks its when attempting to go to level_1A

		//player
		p.setup(game);

		//generate the rounds
		manage.generate_rounds(level_name);

		tick = game.time.create(false);
		tick.loop(2000, manage.updateTick, this, level_name);
		tick.start();

		//setup controlers and keyboards
		c.setup(game);

		//sfx and gui
		sfx.setup(game);
		//modal screen setups ie pause and popups
		m.setup(game);
		//k.setup(game);
	},

	update_level: function(game){
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

		//if(game.input.keyboard.isDown(Phaser.Keyboard.ESC)){ m.pause(game);} //moved out to pause.js as expriment

		manage.lose_condition(game);
	},

	numProps: function(obj) {
		var c = 0;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) ++c;
		}
		return c;
	},

	generate_rounds: function(name){
		game.rounds = [];
		boss_active = 0;
		l = manage.numProps(game.level_range[name]);

		for (r = 0; r < game.set_rounds; r++) {
			test = [];

			for (e = 0; e < l; e++){

				min = game.level_range[name][e]['min']
				max = game.level_range[name][e]['max']

				element = game.rnd.integerInRange(min, max);

				round_factor = element/game.num_players;

				tt = round_factor*r;

				if(game.num_players >= 2){
					add = element*game.num_players;
					nnn = tt+add;
				}else{
					nnn = tt;
				}

				final_element = nnn+element;
				final_element = Math.round(final_element);

				test.push(element);

			}
			game.rounds.push(test);
		}
		//console.log(game.rounds);
		//game.rounds.sort();
	},

	updateTick: function(name) {
			if(boss_active == 0){
			if (game.enemies.countLiving() <= 0) {

				l = manage.numProps(game.rounds[game.count_rounds]);

				for (i = 0; i < l; i++) {
					num = game.rounds[game.count_rounds][i];
					type = game.level_range[name][i]['enemy'];
					for (j = 0; j < num; j++){
						manage.spawn_enemy(type);
					}
				}

				if(game.count_rounds == (game.set_rounds-1)){
					manage.spawn_boss(0);
					boss_active = 1;
				}

				game.count_rounds++; // notice count
				p.add_pickup(game);

			}
		}else{
			if (game.enemies.countLiving() <= 0) {
				console.log("end of boss");
				//boss_active == 0
				game.state.start('level_1A');
			}
		}
	},

	spawn_enemy: function(type) {

		//type = 5 ;

		if(type == 0 || type == 1 || type == 2){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_basic(game, type);
			}

		}else if(type == 3){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_fighter(game);
			}

		}else if(type == 4 || type == 5){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_follower(game, type);
			}

		}else{

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_light(game);
			}

		}

		nme.revive(nme.health);
		nme.x = game.rnd.integerInRange(0, game.width);
		nme.y = game.rnd.integerInRange(0, -(game.height));

		return nme;
	},

	spawn_boss: function(type) {
		console.log("spawn boss");
		//type = 0;

		if(type == 0){
			var boss = game.enemies.getFirstDead();
			//if (boss === null) {
			boss = new e_boss(game, type);
			//}
		}

		boss.revive(boss.health);
		boss.tint = "0xff00ff";
		boss.x = game.rnd.integerInRange(0, game.width);
		boss.y = game.rnd.integerInRange(0, -50);

		return boss;
	},

	lose_condition: function(game){
		if(game.mega_zord.countDead() != 0){
			if(game.players.countDead() == game.num_players){
				console.log("everyone dead");
				//k.ill_screen(game);
			}
		}
	}

};

module.exports = manage;
