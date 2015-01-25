
var e_basic = require('e_basic');
var e_follower = require('e_follower');
var e = require('e');

var p = require('player');
var megazord = require('megazord');
var c = require('controls');
var g = require('general');

var sfx = require('sfx');

var pickup = require('pickup');

var m = require('pause');

module.exports = function(game) {

	var count = 0; // this should probably be game.count

	//var indicator = [];
	//var special_active = 0;

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

	generate_rounds();

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

	/* //working following
	var gray = game.add.filter('Gray');
	logo.filters = [gray];
	*/

	//console.log(game.players.getAt(0));
};
////////// end of create /////////

	var rounds = [];
	function generate_rounds(){
		for (i = 0; i < 2; i++) {
			element = game.rnd.integerInRange(1, 5);
			if(rounds.indexOf(element) == -1){
				rounds.push(element);
			}else{
				i--;
			}
			//console.log(i);
		}
		rounds.sort();
		//console.log(rounds);
	}

	function updateTick() {
		//console.log(rounds);
		//randomly generate change up on rounds and amount per round
		//maybe look into array to store what comes when

		if (game.enemies.countLiving() < 1) {

			if(rounds[0] < count){
				for (i = 0; i < 10; i++) {
					game.spawn_enemy(this.game.rnd.integerInRange(0, this.game.width), this.game.rnd.integerInRange(0, -(this.game.height/2)), 0);
				}
			}
			if(rounds[1] < count){
				for (i = 0; i < 10; i++) {
					game.spawn_enemy(this.game.rnd.integerInRange(0, this.game.width), -30, 1);
				}
			}
			if(rounds[2] < count){
				for (i = 0; i < 10; i++) {
					game.spawn_enemy(this.game.rnd.integerInRange(0, this.game.width), -30, 2);
				}
			}
			count++; // notice count
		}
	}

	game.spawn_enemy = function(x, y, type) {

		if(type == 0 || type == 1 || type == 2){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_basic(game, 0, 0, type);
			}

		}else if(type == 3){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_missile(game, 0, 0);
			}

		}else{

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_follower(game, 0, 0);
			}

		}

		nme.revive(nme.health);

		nme.x = x;
		nme.y = y;

		return nme;
	};


	/*
	function gofull() {
		game.scale.startFullScreen();
	}
	*/

gameState.update = function (){

	//game.filter.update();

	//notice a player collecting a pickup
	game.physics.arcade.overlap(game.players, game.pickups, p.pickedup, null, this);


	//game.physics.arcade.overlap(game.players, game.enemies, p.collision_notice, null, this);
	game.physics.arcade.collide(game.players, game.enemies, p.collision_notice, null, this);

	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, game.enemies, p.add_point, null, this);

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
	console.log(game.mega_zord.countAlive());
	if(game.mega_zord.countAlive() == 0){
		if(game.players.countDead() == game.num_players){
			//lose game
		}
	}
}



	return gameState;
};
