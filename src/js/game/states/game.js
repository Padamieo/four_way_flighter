module.exports = function(game) {
	var background;
	var pos = [];
	
	var score = 0;
	var scoreText;
	
	var num_players;
	var players; //not needed but was trying to resolve group issue
	var player = [];
	var pad = [];
	var indicator = [];
	var nextShotAt = [];
	var shotDelay = [];
	
	var enemies;
	var lives;
	
	var special_active = 0;
	
	var gameState = {};

  gameState.create = function () {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
	
	// obtain number of players
	num_players = game.num_players;
	
	//this is the standard physics with phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//this is the background
	background = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'sky');
	
	// player setup move this out to function
	players = game.add.group();
    players.enableBody = true;
    players.physicsBodyType = Phaser.Physics.ARCADE;
	for (i = 0; i < num_players; i++) {
		player_setup(i);
	}
	players.setAll('anchor.x', 0.5);
	players.setAll('anchor.y', 0.5);
	players.setAll('health', 10);
	
	//health bars position currently 1342
	healthbars = game.add.group();
	for (i = 0; i < num_players; i++) {
		if(i == 0){ x = 5;}
		if(i == 1){ x = (game.stage.bounds.width-5); }
		if(i == 2) { x = (game.stage.bounds.width/4);}
		if(i == 3){ x = (game.stage.bounds.width-(game.stage.bounds.width/4)); }
		healthbar = healthbars.create(x,  game.stage.bounds.height-5, 'health_bar');
		if(i == 0 || i == 2){
			healthbar.anchor.x=0;
			healthbar.anchor.y=1;
		}else{
			healthbar.anchor.x=1;
			healthbar.anchor.y=1;
		}
	}
	//control height some how
	
    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);
		
	// setup health pickup 
	healths = game.add.group();
	healths.enableBody = true;
	healths.physicsBodyType = Phaser.Physics.ARCADE;
	health = healths.create(300, 300, 'health');
	health = healths.create(500, 300, 'health');
	
	// setup live pickup
	lives = game.add.group();
	lives.enableBody = true;
	lives.physicsBodyType = Phaser.Physics.ARCADE;
	live = lives.create(600, 100, 'live');
	
	//when players are combined this is what is used
	player_combo = game.add.sprite(game.world.centerX, game.world.centerY, 'player_combo');
	player_combo.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player_combo);
    player_combo.body.collideWorldBounds = true;
	player_combo.kill();
	
	//enemies group
	enemies = game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.ARCADE;
	//add single enemy	
	enemy = enemies.create(700, 300, 'box');
	enemies.setAll('health', 100);
	
	/*
	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();
	*/
	
	//setup energy score info
	textpos = (game.stage.bounds.width)-(game.stage.bounds.width/2);
	scoreText = game.add.text(textpos, game.stage.bounds.height-14, '0', { fontSize: '12px', fill: '#000' });
	scoreText.anchor.x=0.5;
	scoreText.anchor.y=0.5;
	update_score(0);
	
	for (i = 0; i < num_players; i++) {
		pad_setup(i);
	}
	
	//bullet pool could be individual
	game.bulletPool = game.add.group();
	game.bulletPool.enableBody = true;
	game.bulletPool.physicsBodyType = Phaser.Physics.ARCADE
	game.bulletPool.createMultiple(10, 'bullet'); //needs to be based on amount of players
	game.bulletPool.setAll('anchor.x', 0.5);
	game.bulletPool.setAll('anchor.y', 0.5);
	game.bulletPool.setAll('outOfBoundsKill', true);
	game.bulletPool.setAll('checkWorldBounds', true);

	for (i = 0; i < num_players; i++) {
		fire_setup(i);
	}
	
	//invincible timer
	invincible = game.time.create(false);
	invincible.loop(2000, invincible_time, this);
	//tick.start();
 };

//invincible timer
var now_invincible = 0;
function invincible_time(){
	console.log("stop invincible");
	now_invincible = 0;
	invincible.stop();
}

	function player_setup(num){
		pos = (game.stage.bounds.height/3);
		pos2 = (game.stage.bounds.width/num_players+2);
		if(num == 0){ pos2 = (pos2/2)-5; }else{ pos2 = pos2*num+(pos2/2)-5; }
		
		player[num] = players.create(pos2, pos*2, 'dude');
		player[num].body.collideWorldBounds=true;
		player[num].name=num;
		//player[num].health(2);
		//player[num].body.bounce.y=0.2;
		
		// animations still usefull but not bring used set
		player[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		player[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		player[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
	}

	function pad_setup(num){
	
		indicatorpos = (game.stage.bounds.width)-(22);
		indicator[num] = game.add.sprite(indicatorpos,(num*10), 'controller-indicator');
		indicator[num].scale.x = indicator[num].scale.y = 1;
		indicator[num].animations.frame = 1;
		game.input.gamepad.start();
		// To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
		if(num == 0){
			pad[num] = game.input.gamepad.pad1;
		}
		if(num == 1){
			pad[num] = game.input.gamepad.pad2;
		}
		if(num == 2){
			pad[num] = game.input.gamepad.pad3;
		}
		if(num == 3){
			pad[num] = game.input.gamepad.pad4;
		}
	}
	
	function pad_connect_indicator(num){
		if(game.input.gamepad.supported && game.input.gamepad.active && pad[num].connected) {
			indicator[num].animations.frame = 0;
		} else {
			indicator[num].animations.frame = 1;
		}
	}

	function update_score(score){
		scoreText.text = '' + score + '';
	}
	
	function updateTick() {
		//update the score
		//score = score - 3;
		//update_score(score);
	}	
  
	function gofull() {
		game.scale.startFullScreen();
	}

	
	function fire_setup(num){
		
		nextShotAt[num] = 0;
		shotDelay[num] = 30;
	}

	function fire(num) {
		if (nextShotAt[num] > game.time.now) {
			return;
		}
		nextShotAt[num] = game.time.now + shotDelay[num];
		
		if (game.bulletPool.countDead() === 0) {
			return;
		}
		
		bullet = game.bulletPool.getFirstExists(false);
		if(special_active == 1){
			bullet.reset(player_combo.x, player_combo.y, 'bullet');
			//bullet.name=;
		}else{
			bullet.reset(player[num].x, player[num].y, 'bullet');
			bullet.name=num;
		}
		if ( cursors.left.isDown ||  pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
			bullet.body.velocity.x -= 500;
		}else if (cursors.right.isDown ||  pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
			bullet.body.velocity.x += 500;
		}
		if (cursors.up.isDown || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
			bullet.body.velocity.y -= 500;
		}else if (cursors.down.isDown || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
			bullet.body.velocity.y += 500;
		}
	}

function controls(num){

	cursors = game.input.keyboard.createCursorKeys();
	
	if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				fire(num);
			}else{
				if(num == 1){
					fire(1);
				}
			}
		}else{
			if(players.getAt(num).alive == 1){
				fire(num);
				speed = 3;
			}
		}
	}else{
		speed = 7;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.A) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		if(special_active == 1){
			if(num_players == 0){
				player_combo.x -= speed;
				if( player_combo.angle > -20 ){
					player_combo.angle -= 1;
				}
			}else{
				if(num == 0){
					player_combo.x -= speed;
					if( player_combo.angle > -20 ){
						player_combo.angle -= 1;
					}
				}
			}
			
		}else{
			if(players.getAt(num).alive == 1){
				player[num].x -= speed;
				if( player[num].angle > -20 ){
					player[num].angle -= 1;
				}
			}
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.x += speed;
				if( player_combo.angle < 20 ){
					player_combo.angle += 1;
				}
			}else{
				if(num == 0){
					player_combo.x += speed;
					if( player_combo.angle < 20 ){
						player_combo.angle += 1;
					}
				}
			}
		}else{
			if(players.getAt(num).alive == 1){
				player[num].x += speed;
				if( player[num].angle < 20 ){
					player[num].angle += 1;
				}
			}
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.W) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		if(special_active == 1){
			if(num_players == 0){
				player_combo.y -= speed;
			}else{
				if(num == 0){
					player_combo.y -= speed;
				}
			}
		}else{
			if(players.getAt(num).alive == 1){
				player[num].y -= speed;
				//player.animations.play('forward');
			}
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.y += speed;
			}else{
				if(num == 0){
					player_combo.y += speed;
				}
			}
		}else{
			if(players.getAt(num).alive == 1){
				player[num].y += speed;
				//player.animations.play('back');
			}
		}
	}
}

function combo_notice(num){
	if( pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
		//shine and noise
		if(players.countLiving() == num_players){
			//also check they have engouth juice and more than 50 health
				return 1;
		}
	}
}

gameState.update = function (){
		
	game.physics.arcade.overlap(players, healths, collecthealth, null, this);
	
	//dont want player to die on contact maybe just get injured
	game.physics.arcade.overlap(players, enemies, killplayer, null, this);
	
	//live revive pickup this does not work yet
	game.physics.arcade.overlap(players, lives, pickup_revive, null, this);
	
	//this is not working
	game.physics.arcade.collide(players, enemies, something, null, this);
	
	//
	game.physics.arcade.overlap(game.bulletPool, enemies, add_point, null, this);
	
	
	all = 0;
    // Pad "connected or not" indicator
	for (i = 0; i < num_players; i++) {
		pad_connect_indicator(i);
		
		controls(i);
		
		if(special_active == 0){
			all = all+combo_notice(i);
		}
	}
	
	if(all == num_players){
		console.log("merge"+all);
		value = players.countLiving();
		console.log(value);
		
		//we need this visually
		//var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		//logo.anchor.setTo(0.5, 0.5);
		
		//combo health based on group health, complex i know
		player_combo.revive(10);
		
		//would be nice to animate joining in center
		//players.forEach(game.physics.arcade.moveToObject, this, this, logo);
		players.forEach( killplayer, this, true);
		
		special_active = 1;		
		//if health or maintance of combo drop this will become 0
	}
	
	//console.log(players.getAt(0).health);
	
	background.tilePosition.y += 1.50;
	
};


function add_point (bullet, enemies){
	console.log(enemies.health);
	//console.log(bullet.name);
	//enemies.kill();
	bullet.kill();
	enemies.damage(1);
	console.log(enemies.health);
}


function pickup_revive (players, lives){
	lives.kill();
	revive_player();
}

function revive_player(){
	if(players.countLiving() == num_players){
		return;
	}else{
		dead_player = players.getFirstDead();
		//move to appropriate position
		dead_player.x = 10;
		dead_player.y = 10;
		dead_player.revive(10);
		//need to trigger temp invincible
	}
}

function collecthealth (players, health) {
    // Removes the health from the screen
    health.kill();
	players.damage(-1);
	//console.log(players.health);
	console.log(players.name);
    // Add and update the score
    score += 7;
	update_score(score);
 
}

//this is not used
function lose_condition(){
	if(special_active == 0){
		if(players.countDead() == num_players){
			//lose game
		}
	}
}


function killplayer (players, enemies) {
    // Removes the star from the screen
	//players.kill();
	console.log("trigger hurt");
	if(now_invincible == 0){
		now_invincible = 1;
		console.log("start invincible");
		players.damage(1);
		invincible.start();
	}
}

function something (players, enemies) {
	console.log("hit");
}

	return gameState;
};
