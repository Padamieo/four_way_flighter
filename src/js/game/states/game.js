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
	
	var nextKillAt = [];
	var KillDelay = [];
	
	var enemies;
	var lives;
	var recently_created = 0;
	
	var now_invincible = [];
	var special_active = 0;
	
	var development = 1;
	var development_alt_controls = 1;
	
	var gameState = {};

gameState.create = function () {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
	
	// obtain number of players
	num_players = game.num_players;
	//obtain if keyboard is active
	keyboard_offset = game.keyboard_offset;

	//this is the standard physics with phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);
		
	if(development == 1){
		game.stage.backgroundColor = '#28A3CA';
	}else{
		//this is the background
		background = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'sky');
	}

	// player setup move this out to function
	game.starting_player_health = 10;
	players = game.add.group();
    players.enableBody = true;
    players.physicsBodyType = Phaser.Physics.ARCADE;
	for (i = 0; i < num_players; i++) {
		player_setup(i);
	}
	players.setAll('anchor.x', 0.5);
	players.setAll('anchor.y', 0.5);
	players.setAll('health', game.starting_player_health);
	
	//health bars position currently 1342
	game.healthbars = game.add.group();
	for (i = 0; i < num_players; i++) {
		if(i == 0){ x = 5;}
		if(i == 1){ x = (game.stage.bounds.width-5); }
		if(i == 2) { x = (game.stage.bounds.width/4);}
		if(i == 3){ x = (game.stage.bounds.width-(game.stage.bounds.width/4)); }
		game.healthbar = game.healthbars.create(x,  game.stage.bounds.height-5, 'health_bar');
		if(i == 0 || i == 2){
			game.healthbar.anchor.x=0;
			game.healthbar.anchor.y=1;
		}else{
			game.healthbar.anchor.x=1;
			game.healthbar.anchor.y=1;
		}
		//set initial height
		change = game.healthbars.getAt(i);
		change.scale.y = player[i].health/5;
	}
		
    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);
		
	// setup health pickup 
	healths = game.add.group();
	healths.enableBody = true;
	healths.physicsBodyType = Phaser.Physics.ARCADE;
	healths.setAll('outOfBoundsKill', true);
	
	// setup live pickup
	lives = game.add.group();
	lives.enableBody = true;
	lives.physicsBodyType = Phaser.Physics.ARCADE;
	lives.setAll('outOfBoundsKill', true);
	
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
	//enemy = enemies.create(700, 300, 'box');
	//enemies.setAll('health', 100);
	game.physics.enable([players,enemies], Phaser.Physics.ARCADE);
    //enemy.body.velocity.setTo(200, 200);
    //enemy.body.collideWorldBounds = true;
    //enemy.body.bounce.setTo(1, 1);
	
	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();
	
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
	game.bulletPool.createMultiple(10*num_players, 'bullet'); //needs to be based on amount of players
	game.bulletPool.setAll('anchor.x', 0.5);
	game.bulletPool.setAll('anchor.y', 0.5);
	game.bulletPool.setAll('outOfBoundsKill', true);
	game.bulletPool.setAll('checkWorldBounds', true);

	for (i = 0; i < num_players; i++) {
		fire_setup(i);
		now_invincible[i] = 0;
	}
	
};

	function player_setup(num){
		pos = (game.stage.bounds.height/3);
		pos2 = (game.stage.bounds.width/num_players+2);
		if(num == 0){ pos2 = (pos2/2)-5; }else{ pos2 = pos2*num+(pos2/2)-5; }
		
		player[num] = players.create(pos2, pos*2, 'dude');
		player[num].body.collideWorldBounds=true;
		player[num].name=num;
		//player[num].health(2);
		//player[num].body.bounce.y=0.2;
		/*
		if(development_alt_controls){
		*/
			player[num].body.immovable = false;
		/*
		}else{
		
			player[num].body.immovable = true;
		}
		*/
		
		player[num].animations.frame = 2;
		// animations still usefull but not being used / set
		//player[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//player[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//player[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
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
	
			add_enemies();
			add_revive();
			add_health(); //wip
		//update the score
		//score = score - 3;
		//update_score(score);
		
	}
	
	function add_enemies(){
		// enemy movement https://github.com/photonstorm/phaser/wiki/Phaser-General-Documentation-:-Groups
		if(enemies.countLiving() == 0){
			enemy = enemies.create(game.world.randomX, -30, 'box');
			enemies.setAll('health', 1);
			enemies.setAll('anchor.x', 0.5);
			enemies.setAll('anchor.y', 0.5);
			enemy.body.velocity.setTo(25, 200);
			enemy.body.collideWorldBounds = true;
			enemy.body.bounce.setTo(1, 1);
			
			enemy = enemies.create(game.world.randomX, game.world.randomY, 'box');
			enemy.body.collideWorldBounds = true;
			
		}
	}
	
	function add_revive(){
		if(players.countLiving() != num_players && recently_created != 1){
			live = lives.create(game.world.randomX, -30, 'live');
			live.body.velocity.setTo(0, 100);
			recently_created = 1;
		}
	}
	
	function add_health(){
		
		//needs to be defined on game start
		starting_group_health = 300;
		//starting_player_health
		//feel there is a better way to check this
		//forEachAlive(callback, callbackContext) http://docs.phaser.io/Phaser.Group.html
		game.startt = 0;
		players.forEachAlive( check_health, this);
		group_health = game.startt;
		/*
		group_health = 0;
		for (i = 0; i < num_players; i++){
			individual_health = player[i].health;
			group_health = group_health + individual_health;
		}
		*/
		//console.log(group_health);
		
		if(group_health < starting_group_health){
			health = healths.create(game.world.randomX, -30, 'health');
			health.body.velocity.setTo(0, 100);
			//recently_created = 1; //needs to work specifically for health?
		}
		
	}
	
	function check_health(player){
		check_h = player.health;
		game.startt = game.startt+check_h;
		//console.log(check_h);
		//return check_h;
	}
  
	function gofull() {
		game.scale.startFullScreen();
	}

	
	function fire_setup(num){
		nextShotAt[num] = 0;
		shotDelay[num] = 50;
		
		nextKillAt[num] = 0;
		KillDelay[num] = 600;
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
	test_one = 0;
	test_two = 0;
	
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
				if(development_alt_controls){
					speed = 220;
				}else{
					speed = 3;
				}
				
			}
		}
	}else{
		if(development_alt_controls){
			speed = 290;
		}else{
			speed = 7;
		}
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
				//yet to be decided
				if(development_alt_controls){
					player[num].body.velocity.x = -speed;
				}else{
					player[num].x -= speed;
				}
				
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
				//yet to be decided
				if(development_alt_controls){
					player[num].body.velocity.x = speed;
				}else{
					player[num].x += speed;
				}
				
				if( player[num].angle < 20 ){
					player[num].angle += 1;
				}
			}
		}
	}else{
		test_one = 1;
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
				//yet to be decided
				if(development_alt_controls){
					player[num].body.velocity.y = -speed;
				}else{
					player[num].y -= speed;
				}
				
				//player.animations.play('forward');
				if(now_invincible[num] == 0){
					player[num].animations.frame = 2;
				}
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
				//yet to be decided
				if(development_alt_controls){
					player[num].body.velocity.y = speed;
				}else{
					player[num].y += speed;
				}			
				//player.animations.play('back');
				if(now_invincible[num] == 0){
					player[num].animations.frame = 3;
				}
			}
		}
	}else{
		test_two = 2;
	}
	
	if( test_one+test_two == 3){
		if( player[num].angle != 0){
			if(player[num].angle < -0){
				player[num].angle += 1;
			}
			if(player[num].angle > 0){
				player[num].angle -= 1;
			}
		}

		if(now_invincible[num] == 0){
			if(player[num].animations.frame != 0){
				player[num].animations.frame = 0;
			}
		}
		
		player[num].body.velocity.y *= 0.96;
		player[num].body.velocity.x *= 0.96;
		
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
	game.physics.arcade.collide(players, enemies, killplayer, null, this);
	
	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, enemies, add_point, null, this);
	
	
	all = 0;
    // Pad "connected or not" indicator
	for (i = 0; i < num_players; i++) {
		pad_connect_indicator(i);
		
		controls(i);
		
		if(special_active == 0){
			all = all+combo_notice(i);
		}
		
		if(now_invincible[i] == 1){
			player[i].animations.frame = 1;
		}
		
		if (nextKillAt[i] < game.time.now) {
			now_invincible[i] = 0;
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
	
	if(development == 0){
		background.tilePosition.y += 1.50;
	}
};


function add_point (bullet, enemies){
	//console.log(enemies.health);
	//console.log(bullet.name);
	//enemies.kill();
	bullet.kill();
	enemies.damage(1);
}


function pickup_revive(players, lives){
	lives.kill();
	revive_player(lives); //this lives input may be an issue later
}

function revive_player(lives){
	if(players.countLiving() == num_players){
		return;
		recently_created = 0;
	}else{
		dead_player = players.getFirstDead();
		//move to appropriate position
		dead_player.x = lives.x;
		dead_player.y = lives.y;
		dead_player.revive(10);
		//need to trigger temp invincible
		recently_created = 0;
	}
}

function collecthealth (players, health) {
    // Removes the health from the screen
    health.kill();
	players.damage(-1);
	//console.log(players.health);
	//console.log(players.name);
	//console.log(players.z);
	
	change = game.healthbars.getAt(players.z-1);
	change.scale.y = players.health/5;
	
    // Add and update the score
    score += 1;
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
	num = players.z-1;
	console.log(num);
	if (nextKillAt[num] > game.time.now) {
		now_invincible[num] = 1;
	}else{
		now_invincible[num] = 0;
		nextKillAt[num] = game.time.now + KillDelay[num];
		console.log(players.health);
		players.damage(1);
		
		//this need functioning out
		change = game.healthbars.getAt(num);
		change.scale.y = players.health/5;
	}

}

function something (players, enemies) {
	console.log("hit");
	players.damage(1);
	//players.kill();
}

	return gameState;
};
