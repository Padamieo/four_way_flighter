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
	//sprite.player.setTo(0.5,0.5);
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
	
    //  Create our Timer
    timer = game.time.create(false);
    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(3500, updateCounter, this);
    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();
	
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
	
 };
	function update_energy(score){
		scoreText.text = 'Score: ' + score;
	}
  
	function updateCounter() {
		var value = game.rnd.pick(pos);
		var star = stars.create(game.stage.bounds.width, value, 'star');
		star.body.velocity.x = -100;
		//add gravity bounce to stars i think this is too much
        //star.body.gravity.y = 100;
		//star.body.bounce.y = 0.8 + Math.random() * 0.7;
	}
	
	function updateTick() {
		//update the score
		score = score - 3;
		update_energy(score);
	}	
  
	function gofull() {
		game.scale.startFullScreen();
	}
  
gameState.update = function (){
  
	//game.physics.arcade.collide(player, platforms);
		
	//game.physics.arcade.overlap(player, stars, collectStar, null, this);

	//game.physics.arcade.collide(stars, platforms);
	
	cursors = game.input.keyboard.createCursorKeys();
	 
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
	
	
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
    if ((pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) || cursors.left.isDown){
        
		player.x--;
		player.body.velocity.x = -160;
		
    }if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 || cursors.right.isDown){

		player.x++;
		player.body.velocity.x = 160;
	
    }if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 || cursors.up.isDown){
       
	   player.y--;
	   player.body.velocity.y = -140;
		
    }if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 || cursors.down.isDown){
        
		player.y++;
		player.body.velocity.y = 140;
		
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
