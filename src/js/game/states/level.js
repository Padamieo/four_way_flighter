
var e_basic = require('e_basic');
var e_follower = require('e_follower');
var e = require('e');

var p = require('player');
var c = require('controls');
var g = require('general');

var sfx = require('sfx');

var pickup = require('pickup');

var m = require('modal');

module.exports = function(game) {

	var score = 0;
	var scoreText;
	var count = 0; // this should probably be game.count

	//var indicator = [];
	var special_active = 0;

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

/*
	//when players are combined this is what is used
	player_combo = game.add.sprite(game.world.centerX, game.world.centerY, 'player_combo');
	player_combo.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(player_combo);
  player_combo.body.collideWorldBounds = true;
	player_combo.kill();
*/

	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();

	//setup energy score info
	textpos = (game.width)-(game.width/2);
	scoreText = game.add.text(textpos, game.height-14, '0', { fontSize: '12px', fill: '#000' });
	scoreText.anchor.x=0.5;
	scoreText.anchor.y=0.5;
	update_score(0);

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

	function update_score(new_score){
		score = score + new_score;
		scoreText.text = '' + score + '';
	}

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

			add_pickup(); // issues
	}

	game.spawn_enemy = function(x, y, type) {

		type = 1; // temporary

		if(type == 1){

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_basic(game, 0, 0);
			}

		}else if(type == 2){

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

	function add_pickup(){

		//health_threshold = (game.starting_players_health/4);
		current_health = p.check_players_health(game, game.players);

		//health
		if(current_health < (game.starting_players_health/4)){
			var item = game.pickups.getFirstDead();
			if (item === null) {
				item = new pickup(game, 0);
			}
		}

		//lives
		if(game.players.countLiving() != game.num_players){
			var item = game.pickups.getFirstDead();
			if (item === null) {
				item = new pickup(game, 1);
			}
		}

	}

	/*
	function gofull() {
		game.scale.startFullScreen();
	}
	*/

/*
function combo_notice(num){
	value = 0;

	if(game.keyboard_offset == 1 && num == 0){
		if( game.input.keyboard.isDown(Phaser.Keyboard.E) ){
			//shine and noise
			if(game.players.countLiving() == game.num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}else{
		if(game.keyboard_offset == 1){ num = num-1;}
		if( game.pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
			//shine and noise
			if(game.players.countLiving() == game.num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}

	return value;
}
*/

gameState.update = function (){

	//game.filter.update();

	//notice a player collecting a pickup
	game.physics.arcade.overlap(game.players, game.pickups, p.pickedup, null, this);


	//game.physics.arcade.overlap(game.players, game.enemies, p.collision_notice, null, this);
	game.physics.arcade.collide(game.players, game.enemies, p.collision_notice, null, this);

	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, game.enemies, add_point, null, this);

	//this is for a bit of fun players shoot move other players, may want to drop if resources are concern
	game.physics.arcade.collide(game.bulletPool, game.players, p.ricochet, null, this);

	all = 0;
	cursors = game.input.keyboard.createCursorKeys();
	for (i = 0; i < game.num_players; i++) {
		//pad_connect_indicator(i);

		/*
		if(special_active == 0){
			all = all+combo_notice(i);
		}
		*/
		/*
		if(game.now_invincible[i] == 1){
			game.players.getAt(i).alpha = 0.2;
		}
		*/
	}

	if(all == game.num_players){
		//console.log("merge"+all);
		value = game.players.countLiving();
		//console.log(value);

		//we need this visually
		//var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		//logo.anchor.setTo(0.5, 0.5);

		//combo health based on group health, complex i know
		//player_combo.revive(10);

		//would be nice to animate joining in center
		//players.forEach(game.physics.arcade.moveToObject, this, this, logo);
		game.players.forEach( kill_players, this, true);

		special_active = 1;
		//if health or maintance of combo drop this will become 0
	}

	//console.log(players.getAt(0).health);

	//if player bullets remove them please.
	game.bulletPool.forEachAlive(function(bullet){
		bulletspeed = Math.abs(bullet.body.velocity.y) + Math.abs(bullet.body.velocity.x);
		if( bulletspeed < 200){ bullet.kill(); }
	});

	if(game.input.keyboard.isDown(Phaser.Keyboard.P)){ g.pause(game);}

};

function add_point (bullet, enemy){
	bullet.kill();
	enemy.damage(1);
	if(enemy.health == 0){
		//bullet.name //get player who shots id
		update_score(1);
	}
}

//this is not used yet
function lose_condition(){
	//if(special_active == 0){
		if(game.players.countDead() == game.num_players){
			//lose game
		}
	//}
}

function kill_players(player) {
	player.kill();
}

	return gameState;
};
