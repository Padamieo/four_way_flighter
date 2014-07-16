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
	//game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//this is the background
	//game.add.sprite(30, 0, 'sky');
	far = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'sky');
	
	// The platforms group contains the ground and the 2 ledges we can jump on
    //platforms = game.add.group();
    // We will enable physics for any object that is created in this group
    //platforms.enableBody = true;
    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 40, 'ground');

    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);
    // This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    //var ledge = platforms.create(400, 400, 'ground');
    //ledge.body.immovable = true;

    //ledge = platforms.create(-150, 250, 'ground');
    //ledge.body.immovable = true;
	
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
	/*
	bullet = game.add.sprite(player.x, player.y, 'bullet');
	bullet.anchor.setTo(0.5, 0.5);
	game.physics.enable(bullet, Phaser.Physics.ARCADE);
	bullet.angle -= 1;
	bullet.body.velocity.y = -500;
	//this.bullets.push(bullet);
	*/
	if (game.bulletPool.countDead() === 0) {
		return;
	}
	bullet = game.bulletPool.getFirstExists(false);
	bullet.reset(player.x, player.y, 'bullet');
	if(input = 1){
		bullet.body.velocity.y -= 500;
	}else if ( input = 2 ){
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
	
/*
    if (cursors.left.isDown){
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }else if (cursors.right.isDown){
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }else if (cursors.down.isDown){
		player.body.velocity.y = 150;
    }else if (cursors.up.isDown){
        player.body.velocity.y = -150;
    }else{
        //  Stand still
        //player.animations.stop();
		player.animations.play('default');
	}
*/
    // Pad "connected or not" indicator
    if(game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        indicator.animations.frame = 0;
    } else {
        indicator.animations.frame = 1;
    }

    // Controls
    if ( cursors.left.isDown){
		fire(1);
    }else if ( cursors.right.isDown){
		//player.angle -= 1;
		fire(2);
    }
	
	if (cursors.up.isDown){
		fire();
    }else if (cursors.down.isDown){
		fire();
    }
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
		player.body.velocity.x = -160;
		if( player.angle > -20 ){
			player.angle -= 1;
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		player.body.velocity.x = 160;
		if( player.angle < 20 ){
			player.angle += 1;
		}	
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
		player.body.velocity.y = -140;
		//player.animations.play('forward');
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		player.body.velocity.y = 140;
		//player.animations.play('back');
	}
	
    //player.angle = 0;
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
