module.exports = function(game) {
	var background;
	var pos = [];
	
	var score = 0;
	var scoreText;
	
	var players; //not needed but was trying to resolve group issue
	var player = [];
	var pad = [];
	var indicator = [];
	var nextShotAt = [];
	var shotDelay = [];

//var star;

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
	
	player[0] = players.create(100, 100, 'dude');
	player[0].body.collideWorldBounds=true;
	player[0].body.bounce.y = 0.2;
	//player_setup(0);
	player[1] = players.create(200, 100, 'dude');
	player[1].body.collideWorldBounds=true;
	
	players.setAll('anchor.x', 0.5);
	players.setAll('anchor.y', 0.5);
	
    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);
		
	stars = game.add.group();
	stars.enableBody = true;
	star = stars.create(300, 300, 'star');
	
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
	
	pad_setup(0);
	pad_setup(1);
	
	//bullet pool could be individual
	game.bulletPool = game.add.group();
	game.bulletPool.enableBody = true;
	game.bulletPool.physicsBodyType = Phaser.Physics.ARCADE
	game.bulletPool.createMultiple(10, 'bullet');
	game.bulletPool.setAll('anchor.x', 0.5);
	game.bulletPool.setAll('anchor.y', 0.5);
	game.bulletPool.setAll('outOfBoundsKill', true);
	game.bulletPool.setAll('checkWorldBounds', true);
	/*
	game.nextShotAt = 0;
	game.shotDelay = 30;
	*/
	fire_setup(0);
	fire_setup(1);
 };
 
	function player_setup(num){
	
		//move stuff here
		
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
////////
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
////////
	
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
	 
	//  Reset the players velocity (movement)
	//player[num].body.velocity.x = 0;
	//player[num].body.velocity.y = 0;
		
	// Controls
	if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  pad[num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		fire(num);
		speed = 4;
	}else{
		speed = 8;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.A) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		//player[num].body.velocity.x -= speed;
		//player[num].velocity.x -= 100;
		player[num].x -= speed;
		if( player[num].angle > -20 ){
			player[num].angle -= 1;
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		//player[num].body.velocity.x += speed;
		player[num].x += speed;
		if( player[num].angle < 20 ){
			player[num].angle += 1;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.W) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		//player[num].body.velocity.y = -speed;
		player[num].y -= speed;
		//player.animations.play('forward');
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || pad[num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad[num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		//player[num].body.velocity.y = speed;
		player[num].y += speed;
		//player.animations.play('back');
	}
}
  
gameState.update = function (){
		
	game.physics.arcade.overlap(players, stars, collectStar, null, this);

	//game.physics.arcade.collide(players, enemies);
	
    // Pad "connected or not" indicator
	pad_connect_indicator(0);
	pad_connect_indicator(1);
    
	controls(0);
	controls(1);
	
	background.tilePosition.y += 1.50;
	
};


function collectStar (players, star) {
    // Removes the star from the screen
    star.kill();
	
    //  Add and update the score
    score += 7;
	update_energy(score);
 
}

  return gameState;
};
