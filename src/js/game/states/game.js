module.exports = function(game) {
	var far;
	var pos = [];
	var score = 0;
	var scoreText;
	
var player;
var pad1;
var indicator;

	var gameState = {};

  gameState.create = function () {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
	
	//this is the standard physics with phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//this is the background
	//game.add.sprite(30, 0, 'sky');
	far = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'sky');
		
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
	player.anchor.setTo(0.5,0.5);
    //  We need to enable physics on the player

    game.physics.arcade.enable(player);
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
	
    //  Our two animations, walking left and right.
	player.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
	
    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);
	
	/*
	stars = game.add.group();
	stars.enableBody = true;
	
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
	scoreText = game.add.text(textpos, 16, 'score: 0', { fontSize: '16px', fill: '#000' });
	score = 20;
	update_energy(score);
	
	indicatorpos = (game.stage.bounds.width)-(42);
    indicator = game.add.sprite(indicatorpos,10, 'controller-indicator');
    indicator.scale.x = indicator.scale.y = 1;
    indicator.animations.frame = 1;
    game.input.gamepad.start();
    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    pad1 = game.input.gamepad.pad1;
	
	
	game.bulletPool = game.add.group();
	game.bulletPool.enableBody = true;
	game.bulletPool.physicsBodyType = Phaser.Physics.ARCADE
	game.bulletPool.createMultiple(100, 'bullet');
	game.bulletPool.setAll('anchor.x', 0.5);
	game.bulletPool.setAll('anchor.y', 0.5);
	game.bulletPool.setAll('outOfBoundsKill', true);
	game.bulletPool.setAll('checkWorldBounds', true);
	
game.nextShotAt = 0;
game.shotDelay = 30;
 };
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
	
function fire(input) {
	if (game.nextShotAt > game.time.now) {
		return;
	}
	game.nextShotAt = game.time.now + game.shotDelay;
	
	if (game.bulletPool.countDead() === 0) {
		return;
	}
	
	bullet = game.bulletPool.getFirstExists(false);
	bullet.reset(player.x, player.y, 'bullet');
		
	if ( cursors.left.isDown ||  pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
		bullet.body.velocity.x -= 500;
	}else if (cursors.right.isDown ||  pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
		bullet.body.velocity.x += 500;
	}
	if (cursors.up.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
		bullet.body.velocity.y -= 500;
	}else if (cursors.down.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
		bullet.body.velocity.y += 500;
    }
	
}
  
gameState.update = function (){
  
	//game.physics.arcade.collide(player, platforms);
		
	//game.physics.arcade.overlap(player, stars, collectStar, null, this);

	//game.physics.arcade.collide(stars, platforms);
	
	cursors = game.input.keyboard.createCursorKeys();
	 
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
    // Pad "connected or not" indicator
    if(game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        indicator.animations.frame = 0;
    } else {
        indicator.animations.frame = 1;
    }

    // Controls
    if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		fire();
		speed = 160;
    }else{
		speed = 200;
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.A) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		player.body.velocity.x -= speed;
		if( player.angle > -20 ){
			player.angle -= 1;
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		player.body.velocity.x += speed;
		if( player.angle < 20 ){
			player.angle += 1;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.W) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		player.body.velocity.y = -speed;
		//player.animations.play('forward');
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		player.body.velocity.y = speed;
		//player.animations.play('back');
	}
	    
	far.tilePosition.y += 1.50;
	
};

/*
function collectStar (player, star) {
    // Removes the star from the screen
    star.kill();
	
    //  Add and update the score
    score += 7;
	update_energy(score);
 
}
*/
  return gameState;
};
