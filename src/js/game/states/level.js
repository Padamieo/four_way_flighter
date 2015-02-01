
var e_basic = require('e_basic');
var e_follower = require('e_follower');
var e_fighter = require('e_fighter');
var e = require('e');

var p = require('player');
var megazord = require('megazord');
var c = require('controls');
var g = require('general');

var sfx = require('sfx');

var pickup = require('pickup');

var m = require('pause');
var k = require('kill');

var e_boss = require('e_boss');

module.exports = function(game) {

	var count = 0; // this should probably be game.count

/*
	var Gray = require('gray'); //filter grey
	var gray;
	var gray_filter;
*/

	var gameState = {};

gameState.create = function () {
	/*
		var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'Gray');
		logo.anchor.setTo(0.5, 0.5);
	*/

	game.level_range = {
		level: { 0:{enemy: 3, min: 2, max: 10}, 1:{enemy: 0, min: 2, max: 10} },
		levelA: { min: 1, max: 3 }
	};

	generate_rounds('level');

	//general setups
	g.setup(game);

	//enemies setup
	e.setup(game);

	//player
	p.setup(game);

	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();

	//setup controlers and keyboards
	c.setup(game);

	//sfx and gui
	sfx.setup(game);

	//modal screen setups ie pause and popups
	m.setup(game);
	k.setup(game);

	/* //working following
	var gray = game.add.filter('Gray');
	logo.filters = [gray];
	*/

};

////////// end of create /////////
	function numProps(obj) {
		var c = 0;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) ++c;
		}
		return c;
	}

	//var rounds = [];
	function generate_rounds(name){
		game.rounds = [];
		boss_active = 0;
		l = numProps(game.level_range[name]);
		console.log(l);

		for (i = 0; i < l; i++){
			value = game.level_range[name][i];
			//console.log(value);
			element = game.rnd.integerInRange(game.level_range[name][i]['min'], game.level_range[name][i]['max']);
			console.log(element);
		}


		for (i = 0; i < 2; i++) {
			//element = game.rnd.integerInRange(1, 5);
			//if(game.rounds.indexOf(element) == -1){
				game.rounds.push(element);
			//}else{
				//i--;
			//}
			console.log(i);
		}
		game.rounds.sort();
		console.log(game.rounds);

	}


	function updateTick() {
		//console.log(game.rounds);
		//randomly generate change up on rounds and amount per round
		//maybe look into array to store what comes when
		if(boss_active == 0){

			if (game.enemies.countLiving() <= 1) {

				if(game.rounds[0] < count){
					for (i = 0; i < 20; i++) {
						spawn_enemy(0);
					}
				}

				if(game.rounds[0] = 3){
					spawn_boss(0);
					boss_active = 1;
				}

				count++; // notice count
				g.add_pickup(game);
			}
		}


	}

	function spawn_enemy(type) {

		//type = 0;

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

		}else{

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_follower(game);
			}

		}

		nme.revive(nme.health);
		nme.x = game.rnd.integerInRange(0, game.width);
		nme.y = game.rnd.integerInRange(0, -(game.height));

		return nme;
	};

	function spawn_boss(type) {

		//type = 0;

		if(type == 0){
			var boss = game.enemies.getFirstDead();
			if (boss === null) {
				boss = new e_boss(game, type);
			}
		}

		boss.revive(boss.health);
		boss.x = game.rnd.integerInRange(0, game.width);
		boss.y = game.rnd.integerInRange(0, -50);

		return boss;
	};

	gameState.update = function (){

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
		game.physics.arcade.collide(game.bulletPool, game.players, p.ricochet, null, this);

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

	};

	//this is not used yet
	function lose_condition(){
		if(game.mega_zord.countDead() == 0){
			if(game.players.countDead() == game.num_players){
				console.log("everyone dead");
				k.ill_screen(game);
			}
		}
	}
	//

	return gameState;
};
