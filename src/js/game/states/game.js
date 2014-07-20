module.exports = function(game) {
	var background;
	var pos = [];
	
	var score = 0;
	var scoreText;
	
	var num_players = 2;
	var players; //not needed but was trying to resolve group issue
	var player = [];
	var pad = [];
	var indicator = [];
	var nextShotAt = [];
	var shotDelay = [];
	
	var enemies;
	var enemy;
	
	var gameState = {};

  gameState.create = function () {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
	
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
    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);
		
	stars = game.add.group();
	stars.enableBody = true;
	stars.physicsBodyType = Phaser.Physics.ARCADE;
	star = stars.create(300, 300, 'star');
	star = stars.create(500, 300, 'star');
	
	player_combo = game.add.sprite(game.world.centerX, game.world.centerY, 'player_combo');
	player_combo.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player_combo);
    player_combo.body.collideWorldBounds = true;
	player_combo.kill();
	
	
	enemies = game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.ARCADE;
	

	//enemies.body.bounce.setTo(1, 1);
	//enemies.body.velocity.setTo(200, 200);
	//players.body.velocity.setTo(200, 200);
	
	enemy = enemies.create(700, 300, 'box');
	
	
	/*
	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();
	
	var bottomwindow = game.stage.bounds.height;
	var i = bottomwindow;
	while(22 < i){
		var new_pos = (i - 22);
		i = new_pos;
		pos.push(new_pos);
	}
	*/
	
	//setup energy score info
	textpos = (game.stage.bounds.width)-(game.stage.bounds.width/3);
	scoreText = game.add.text(textpos, 12, 'score: 0', { fontSize: '12px', fill: '#000' });
	score = 20;
	update_energy(score);
	
	for (i = 0; i < num_players; i++) {
		pad_setup(i);
	}
	
	//bullet pool could be individual
	game.bulletPool = game.add.group();
	game.bulletPool.enableBody = true;
	game.bulletPool.physicsBodyType = Phaser.Physics.ARCADE
	game.bulletPool.createMultiple(10, 'bullet');
	game.bulletPool.setAll('anchor.x', 0.5);
	game.bulletPool.setAll('anchor.y', 0.5);
	game.bulletPool.setAll('outOfBoundsKill', true);
	game.bulletPool.setAll('checkWorldBounds', true);

	for (i = 0; i < num_players; i++) {
		fire_setup(i);
	}
 };
 
	function player_setup(num){
		pos = (game.stage.bounds.height/3);
		pos2 = (game.stage.bounds.width/num_players+2);
		if(num == 0){ pos2 = (pos2/2)-5; }else{ pos2 = pos2*num+(pos2/2)-5; }
		
		player[num] = players.create(pos2, pos*2, 'dude');
		player[num].body.collideWorldBounds=true;
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

		function update_energy(score){
			scoreText.text = 'Score: ' + score;
		}
		
		function updateTick() {
			//update the score
			//score = score - 3;
			//update_energy(score);
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
		
		bullet.reset(player[num].x, player[num].y, 'bullet');
			
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
		fire(num);
		speed = 3;
	}else{
		speed = 7;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.A) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		player[num].x -= speed;
		if( player[num].angle > -20 ){
			player[num].angle -= 1;
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		player[num].x += speed;
		if( player[num].angle < 20 ){
			player[num].angle += 1;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.W) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		player[num].y -= speed;
		//player.animations.play('forward');
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		player[num].y += speed;
		//player.animations.play('back');
	}
}

//not sure a second contols is needed combine and re think, also except num_player Num_pad
function controls_alt(num){

	cursors = game.input.keyboard.createCursorKeys();
	
	if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		if(num_players = 0){
		fire(num);
		speed = 3;
		}else if(num_players = 1){
			
		}
		
	}else{
		speed = 7;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.A) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		player_combo.x -= speed;
		if( player_combo.angle > -20 ){
			player_combo.angle -= 1;
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		player_combo.x += speed;
		if( player_combo.angle < 20 ){
			player_combo.angle += 1;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.W) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		player_combo.y -= speed;
		//player.animations.play('forward');
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		player_combo.y += speed;
		//player.animations.play('back');
	}
}

function combo_notice(num){
	if( pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
		//shine and noise
		if(players.countLiving() == num_players){
			//also check they have engouth juice
				return 1;
		}
	}
}


//var all = 0;
var special_active = 0;
gameState.update = function (){
		
	game.physics.arcade.overlap(players, stars, collectStar, null, this);
	
	game.physics.arcade.overlap(players, enemies, killplayer, null, this);
	
	//this is not working
	game.physics.arcade.collide(players, enemies, something, null, this);
	
	all = 0;
    // Pad "connected or not" indicator
	for (i = 0; i < num_players; i++) {
		pad_connect_indicator(i);   
		if(special_active == 0){
			controls(i);
			all = all+combo_notice(i);
		}else{
			controls_alt(i);
		}
	}
	
	if(all == num_players){
		console.log("merge"+all);
		value = players.countLiving();
		console.log(value);
		
		//we need this visually
		//var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		//logo.anchor.setTo(0.5, 0.5);
		
		player_combo.revive(10);
		
		//would be nice to animate joining in center
		//players.forEach(game.physics.arcade.moveToObject, this, this, logo);
		players.forEach( killplayer, this, true);
		
		special_active = 1;		
	}
	
	background.tilePosition.y += 1.50;
	
};

function collectStar (players, star) {
    // Removes the star from the screen
    star.kill();
	players.damage(-1);
	console.log(players.health);
    //  Add and update the score
    score += 7;
	update_energy(score);
 
}

function killplayer (players, enemies) {
    // Removes the star from the screen
    players.kill();
 
}

function something (players, enemies) {
	console.log("hit");
}

  return gameState;
};
