
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

	function fire(play_num, pad_num) {
		if (game.nextShotAt[play_num] > game.time.now) {
			return;
		}
		game.nextShotAt[play_num] = game.time.now + game.shotDelay[play_num];

		if (game.bulletPool.countDead() === 0) {
			return;
		}

		bullet = game.bulletPool.getFirstExists(false);
		bullet.reset(game.players.getAt(play_num).x, game.players.getAt(play_num).y, 'bullet');
		bullet.name = play_num;
		bullet.tint = 0xff00ff;

		if(game.keyboard_offset == 1){
			if(play_num == 0){
				if ( cursors.left.isDown){
					bullet.body.velocity.x -= 500;
				}else if (cursors.right.isDown ){
					bullet.body.velocity.x += 500;
				}
				if (cursors.up.isDown){
					bullet.body.velocity.y -= 500;
				}else if (cursors.down.isDown){
					bullet.body.velocity.y += 500;
				}
			}else{
				gamepad_fire(game, pad_num);
			}
		}else{
			gamepad_fire(game, pad_num);
		}

	}

	function gamepad_fire(game, pad_num){
		if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
			bullet.body.velocity.x -= 500;
		}else if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
			bullet.body.velocity.x += 500;
		}
		if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
			bullet.body.velocity.y -= 500;
		}else if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
			bullet.body.velocity.y += 500;
		}
	}

function controls_pad(play_num, pad_num){

	//cursors = game.input.keyboard.createCursorKeys();
	h_test = 0;
	v_test = 0;

	if ( game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		if(game.players.getAt(play_num).alive == 1){
			fire(play_num, pad_num);
			speed = 220;
		}
	}else{
		speed = 300;
	}

	if ( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
			game.avatar[play_num].body.velocity.x = -speed;
			if( game.avatar[play_num].angle > -20 ){
				game.avatar[play_num].angle -= 1;
			}
	}else if( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
			game.avatar[play_num].body.velocity.x = speed;
			if( game.avatar[play_num].angle < 20 ){
				game.avatar[play_num].angle += 1;
			}
	}else{
		h_test = 1;
	}

	if ( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
			game.avatar[play_num].body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			if(game.now_invincible[play_num] == 0){
				game.avatar[play_num].animations.frame = 8+play_num;
			}
	}else if( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
				game.avatar[play_num].body.velocity.y = speed;
				//game.avatar.animations.play('back');
				if(game.now_invincible[play_num] == 0){
					game.avatar[play_num].animations.frame = 12+play_num;
				}
	}else{
		v_test = 2;
	}

	avatar_ani_reset(game, h_test, v_test, play_num);

}

function controls_key(num){

	// cursors = game.input.keyboard.createCursorKeys();
	h_test = 0;
	v_test = 0;

	if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ){
		fire(num, num);
		speed = 220;
	}else{
		speed = 300;
	}

	if ( game.input.keyboard.isDown(Phaser.Keyboard.A) ) {
		game.players.getAt(num).body.velocity.x = -speed;
		if( game.players.getAt(num).angle > -20 ){
			game.players.getAt(num).angle -= 1;
		}
	}else if( game.input.keyboard.isDown(Phaser.Keyboard.D) ){
		game.players.getAt(num).body.velocity.x = speed;
			if( game.players.getAt(num).angle < 20 ){
				game.players.getAt(num).angle += 1;
			}
	}else{
		h_test = 1;
	}

	if ( game.input.keyboard.isDown(Phaser.Keyboard.W) ) {
			game.players.getAt(num).body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			if(game.now_invincible[num] == 0){
				//game.players.getAt(num).animations.frame = 8+num;
			}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) ){
		game.players.getAt(num).body.velocity.y = speed;
			//game.avatar.animations.play('back');
			if(game.now_invincible[num] == 0){
				//game.players.getAt(num).animations.frame = 12+num;
			}
	}else{
		v_test = 2;
	}

	avatar_ani_reset(game, h_test, v_test, num);

}

function avatar_ani_reset(game, h, v, num){
	if( h+v == 3){
		if( game.players.getAt(num).angle != 0){
			y = game.players.getAt(num).y;
			if(game.players.getAt(num).angle < -0){
				game.players.getAt(num).angle += 1;
			}
			if(game.players.getAt(num).angle > 0){
				game.players.getAt(num).angle -= 1;
			}
		}

		if(game.now_invincible[num] == 0){
			if(game.players.getAt(num).animations.frame != 0+num){
				game.players.getAt(num).animations.frame = 0+num;
			}
		}

		game.players.getAt(num).body.velocity.y *= 0.96;
		game.players.getAt(num).body.velocity.x *= 0.96;

	}
};

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


	game.physics.arcade.overlap(game.players, game.enemies, collision_notice, null, this);
	game.physics.arcade.collide(game.players, game.enemies, collision_notice, null, this);

	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, game.enemies, add_point, null, this);

	//this is for a bit of fun players shoot move other players, may want to drop if resources are concern
	game.physics.arcade.collide(game.bulletPool, game.players, ricochet, null, this);

	all = 0;
	cursors = game.input.keyboard.createCursorKeys();
	for (i = 0; i < game.num_players; i++) {
		//pad_connect_indicator(i);
		//if(game.players.getAt(i).alive == 1){
		/*
			if(game.keyboard_offset == 1){
				if(i != 0){
					controls_pad(i, (i-1));
				}else{
					controls_key(i);
				}
			}else{
				controls_pad(i , i);
			}
		*/
		console.log(game.controls[i]);
		controls_key(i);
		//}
		/*
		if(special_active == 0){
			all = all+combo_notice(i);
		}
		*/

		if(game.now_invincible[i] == 1){
			game.players.getAt(i).alpha = 0.2;
		}

		if (game.nextKillAt[i] < game.time.now) {
			game.now_invincible[i] = 0;
		}
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

function ricochet(bullet, player){
	//this does not work quite right
	bullet.body.velocity.x *= -1;
	bullet.body.velocity.y *= -1;

}

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

function collision_notice(ply, enemy) {
	num = ply.z-1;
	if (game.nextKillAt[num] > game.time.now) {
		game.now_invincible[num] = 1;
	}else{
		game.now_invincible[num] = 0;
		game.nextKillAt[num] = game.time.now + game.KillDelay[num];

		ply.damage(1);
		enemy.damage(1);

		sfx.shake(game);
	}
}

function kill_players(player) {
	player.kill();
}

	return gameState;
};
