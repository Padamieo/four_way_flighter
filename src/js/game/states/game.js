
var e_basic = require('e_basic');
var e_follower = require('e_follower');

module.exports = function(game) {
	var background;

	var score = 0;
	var scoreText;
	var count = 0; // this should probably be game.count

	var num_players;

	//var players; //not needed but was trying to resolve group issue

	var player = [];
	var pad = [];
	//var indicator = [];
	var nextShotAt = [];
	var shotDelay = [];

	var nextKillAt = [];
	var KillDelay = [];

	var lives;
	var recently_created = 0;

	var now_invincible = [];
	var special_active = 0;

	var development = 1;

/*
	var Gray = require('gray'); //filter grey
	var gray;
	var gray_filter;
*/

	var gameState = {};

gameState.create = function () {
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'Gray');
    logo.anchor.setTo(0.5, 0.5);

	generate();

	game.next_e_ShotAt = [];
	game.e_shotDelay = [];

	// obtain number of players
	num_players = game.num_players;

	//obtain if keyboard is active
	keyboard_offset = game.keyboard_offset;

	//console.log("keybaord_offest"+keyboard_offset);

	//this is the standard physics with phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);

	if(development == 1){
		game.stage.backgroundColor = '#28A3CA';
	}else{
		//this is the background
		background = game.add.tileSprite(0, 0, game.stage.width, game.stage.height, 'sky');
	}

	// player setup move this out to function
	game.starting_player_health = 10;
	game.players = game.add.group();
  game.players.enableBody = true;
  game.players.physicsBodyType = Phaser.Physics.ARCADE;
	for (i = 0; i < num_players; i++) {
		player_setup(i);
	}
	game.players.setAll('anchor.x', 0.5);
	game.players.setAll('anchor.y', 0.5);
	game.players.setAll('health', game.starting_player_health);

	//health bars position currently 1342
	game.healthbars = game.add.group();
	for (i = 0; i < num_players; i++) {
		if(i == 0){ x = 5;}
		if(i == 1){ x = (game.width-5); }
		if(i == 2) { x = (game.width/4);}
		if(i == 3){ x = (game.width-(game.width/4)); }
		game.healthbar = game.healthbars.create(x,  game.height-5, 'health_bar');
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

	//calculate groups health
	game.cal_health = 0;
	game.players.forEachAlive( check_health, this);
	game.starting_group_health = game.cal_health;

	//scorebars
	game.scorebars = game.add.group();
	for (i = 0; i < num_players; i++) {
		if(i == 0){ x = 5;}
		if(i == 1){ x = (game.width-5); }
		if(i == 2) { x = (game.width/4);}
		if(i == 3){ x = (game.width-(game.width/4)); }

		if(i == 0 || i == 2){
			x = x + 12;
		}else{
			x = x - 12;
		}

		game.scorebar = game.scorebars.create(x,  game.height-5, 'score_bar');

		if(i == 0 || i == 2){
			game.scorebar.anchor.x=0;
			game.scorebar.anchor.y=1;
		}else{
			game.scorebar.anchor.x=1;
			game.scorebar.anchor.y=1;
		}

		//set initial height
		change = game.scorebars.getAt(i);
		change.scale.y = 1;
	}

    // Maintain aspect ratio
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
	//game.input.onDown.add(gofull, this);

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
	game.enemies = game.add.group();
	//enemies.events.onKilled(function(){console.log("dead"+this.x+this.y)}, this);

	// --- enemies.enableBody = true;
	// --- enemies.physicsBodyType = Phaser.Physics.ARCADE;
	//add single enemy
	//enemy = enemies.create(700, 300, 'box');
	//enemies.setAll('health', 100);
	// --- game.physics.enable([players,enemies], Phaser.Physics.ARCADE);
    //enemy.body.velocity.setTo(200, 200);
    //enemy.body.collideWorldBounds = true;
    //enemy.body.bounce.setTo(1, 1);

	tick = game.time.create(false);
	tick.loop(2000, updateTick, this);
	tick.start();

	//setup energy score info
	textpos = (game.width)-(game.width/2);
	scoreText = game.add.text(textpos, game.height-14, '0', { fontSize: '12px', fill: '#000' });
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
		invincible_setup(i);
		now_invincible[i] = 0;
	}

	//bullet pool could be individual
	game.e_bulletPool = game.add.group();
	game.e_bulletPool.enableBody = true;
	game.e_bulletPool.physicsBodyType = Phaser.Physics.ARCADE
	game.e_bulletPool.createMultiple(100*num_players, 'bullet'); //needs to be based on amount of players
	game.e_bulletPool.setAll('anchor.x', 0.5);
	game.e_bulletPool.setAll('anchor.y', 0.5);
	game.e_bulletPool.setAll('outOfBoundsKill', true);
	game.e_bulletPool.setAll('checkWorldBounds', true);

	game.explosion = game.add.group();
	game.explosion.createMultiple(100, 'explosion');
	game.explosion.setAll('anchor.x', 0.5);
	game.explosion.setAll('anchor.y', 0.5);
	game.explosion.setAll('killOnComplete',true);
    game.explosion.callAll('animations.add', 'animations', 'boom', [0, 1, 3], 30, false);
    //game.explosion.callAll('animations.play', 'animations', 'boom'); //http://www.html5gamedevs.com/topic/4384-callback-when-animation-complete/

    // Create a white rectangle that we'll use to represent the flash
    game.flash = game.add.graphics(0, 0);
    game.flash.beginFill(0xffffff, 1);
    game.flash.drawRect(0, 0, game.width, game.height);
    game.flash.endFill();
    game.flash.alpha = 0;

    // Make the world a bit bigger than the stage so we can shake the camera
    this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

    // Create a white rectangle that we'll use to represent the flash
    game.pause_background = game.add.graphics(0, 0);
    game.pause_background.beginFill(0x000000, 1);
    game.pause_background.drawRect(0, 0, game.width, game.height);
    game.pause_background.endFill();
    game.pause_background.alpha = 0;

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    function unpause(event){
        if(game.paused){
            // Calculate the corners of the menu
            //var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
             //   y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // Check if the click was inside the menu
			/*
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
			*/
                // Remove the menu and the label
                game.menu.destroy();
                game.choiseLabel.destroy();
				game.pause_background.alpha = 0;
                game.paused = false;
            //}
        }
    };

	//gray = game.add.filter('Gray');

	/*
	gray_filter = game.add.sprite(0.5, 0);
	gray_filter.width = game.width;
	gray_filter.height = game.height;
	*/
	/*
    gray_filter = game.add.graphics(0, 0);
    gray_filter.beginFill(0x000000, 1);
    gray_filter.drawRect(0, 0, game.width, game.height);
    gray_filter.endFill();
    gray_filter.alpha = 0.2;

	gray_filter.gray = [gray];
	gray.alpha = 1;
	*/

	/* //working following
	var gray = game.add.filter('Gray');
	logo.filters = [gray];
	*/

};
////////// end of create /////////
	function pause() {
        // When the paus button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
		w = game.width/2;
		h = game.height/2;
        game.menu = game.add.sprite(w, h, 'menu');
		game.menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        game.choiseLabel = game.add.text(w, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        game.choiseLabel.anchor.setTo(0.5, 0.5);
		game.pause_background.alpha = 0.5;
    };

function random_location(){
	x = game.rnd.integerInRange(0, game.width);
	y = game.rnd.integerInRange(0, game.height);
	var arr = new Array(x, y);
	return arr;
}

	function player_setup(num){
		pos = (game.height/3);
		pos2 = (game.width/num_players+2);
		if(num == 0){ pos2 = (pos2/2)-5; }else{ pos2 = pos2*num+(pos2/2)-5; }

		player[num] = game.players.create(pos2, pos*2, 'dude');
		player[num].body.collideWorldBounds=true;
		player[num].name=num;
		player[num].energy = 0;
		//player[num].health(2);
		//player[num].body.bounce.y=0.2;

			player[num].body.immovable = false;
			//player[num].body.immovable = true;

		player[num].animations.frame = 0+num;
		// animations still usefull but not being used / set
		//player[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//player[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		//player[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
	}

	function pad_setup(num){

		//indicatorpos = (game.width)-(22);
		//indicator[num] = game.add.sprite(indicatorpos,(num*10), 'controller-indicator');
		//indicator[num].scale.x = indicator[num].scale.y = 1;
		//indicator[num].animations.frame = 1;

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

	/*
	function pad_connect_indicator(num){
		if(game.input.gamepad.supported && game.input.gamepad.active && pad[num].connected) {
			indicator[num].animations.frame = 0;
		} else {
			indicator[num].animations.frame = 1;
		}
	}
	*/

	function update_score(new_score){
		score = score + new_score;
		scoreText.text = '' + score + '';
	}

	var rounds = [];
	function generate(){
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
			add_revive(); // issue with only once occurrence per death
			add_health(); // still wip too many healths generated
			//console.log(count);
	}

	game.spawn_enemy = function(x, y, type) {
		if(type == 1){

			// var nme = game.enemies.getFirstDead();
			// if (nme === null) {
			// 	nme = new e_follower(game, 0, 0);
			// }

		}else if(type == 2){

			// var nme = game.enemies.getFirstDead();
			// if (nme === null) {
			// 	nme = new e_missile(game, 0, 0);
			// }

		}else{

			var nme = game.enemies.getFirstDead();
			if (nme === null) {
				nme = new e_follower(game, 0, 0);
			}

		}

		console.log('type'+type);
		//nme.revive(nme.health);

		nme.x = x;
		nme.y = y;

		return nme;
	};


	function add_revive(){
		if(game.players.countLiving() != num_players && recently_created != 1){
			live = lives.create(game.world.randomX, -30, 'live');
			live.body.velocity.setTo(0, 100);
			recently_created = 1;
		}
	}

	function add_health(){

		health_threshold = (game.starting_group_health/4);

		game.cal_health = 0;
		game.players.forEachAlive( check_health, this);
		current_group_health = game.cal_health;

		if(current_group_health < health_threshold){
			health = healths.create(game.world.randomX, -30, 'health');
			health.body.velocity.setTo(0, 100);
			//recently_created = 1; //needs to work specifically for health?
		}

	}

	function check_health(player){
		check_h = player.health;
		game.cal_health = game.cal_health+check_h;
	}

	/*
	function gofull() {
		game.scale.startFullScreen();
	}
	*/

	function fire_setup(num){
		nextShotAt[num] = 0;
		shotDelay[num] = 50;
	}

	function invincible_setup(num){
		nextKillAt[num] = 0;
		KillDelay[num] = 600;
	}

	function fire(play_num, pad_num) {
		if (nextShotAt[play_num] > game.time.now) {
			return;
		}
		nextShotAt[play_num] = game.time.now + shotDelay[play_num];

		if (game.bulletPool.countDead() === 0) {
			return;
		}

		bullet = game.bulletPool.getFirstExists(false);
		if(special_active == 1){
			bullet.reset(player_combo.x, player_combo.y, 'bullet');
			//bullet.name=;
		}else{
			bullet.reset(player[play_num].x, player[play_num].y, 'bullet');
			bullet.name=play_num;
		}

		if ( cursors.left.isDown ||  pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
			bullet.body.velocity.x -= 500;
		}else if (cursors.right.isDown ||  pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
			bullet.body.velocity.x += 500;
		}
		if (cursors.up.isDown || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
			bullet.body.velocity.y -= 500;
		}else if (cursors.down.isDown || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
			bullet.body.velocity.y += 500;
		}
	}

function controls_pad(play_num, pad_num){

	//cursors = game.input.keyboard.createCursorKeys();
	test_one = 0;
	test_two = 0;

	if ( pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				fire(play_num, pad_num);
			}else{
				if(play_num == 1){
					//fire(1);
				}
			}
		}else{
			if(game.players.getAt(play_num).alive == 1){
				fire(play_num, pad_num);
				speed = 220;
			}
		}
	}else{
		speed = 300;
	}

	if ( pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.x = -speed;
				if( player_combo.angle > -20 ){
					player_combo.angle -= 1;
				}
			}else{
				if(play_num == 0){
					player_combo.body.velocity.x = -speed;
					if( player_combo.angle > -20 ){
						player_combo.angle -= 1;
					}
				}
			}

		}else{
			if(game.players.getAt(play_num).alive == 1){
				player[play_num].body.velocity.x = -speed;
				if( player[play_num].angle > -20 ){
					player[play_num].angle -= 1;
				}
			}
		}
	}else if( pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.x = speed;
				if( player_combo.angle < 20 ){
					player_combo.angle += 1;
				}
			}else{
				if(play_num == 0){
					player_combo.body.velocity.x = speed;
					if( player_combo.angle < 20 ){
						player_combo.angle += 1;
					}
				}
			}
		}else{
			if(game.players.getAt(play_num).alive == 1){
				player[play_num].body.velocity.x = speed;
				if( player[play_num].angle < 20 ){
					player[play_num].angle += 1;
				}
			}
		}
	}else{
		test_one = 1;
	}

	if ( pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
		if(special_active == 1){
			if(num_players == 0){
				//player_combo.body.velocity.y = -speed;
			}else{
				if(play_num == 0){
					player_combo.body.velocity.y = -speed;
				}
			}
		}else{
			if(game.players.getAt(play_num).alive == 1){
				player[play_num].body.velocity.y = -speed;
				//player.animations.play('forward');
				if(now_invincible[play_num] == 0){
					player[play_num].animations.frame = 8+play_num;
				}
			}
		}
	}else if( pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.y = speed;
			}else{
				if(play_num == 0){
					player_combo.body.velocity.y = speed;
				}
			}
		}else{
			if(game.players.getAt(play_num).alive == 1){
				player[play_num].body.velocity.y = speed;
				//player.animations.play('back');
				if(now_invincible[play_num] == 0){
					player[play_num].animations.frame = 12+play_num;
				}
			}
		}
	}else{
		test_two = 2;
	}

	if( test_one+test_two == 3){
		if( player[play_num].angle != 0){
			if(player[play_num].angle < -0){
				player[play_num].angle += 1;
			}
			if(player[play_num].angle > 0){
				player[play_num].angle -= 1;
			}
		}

		if(now_invincible[play_num] == 0){
			if(player[play_num].animations.frame != 0+play_num){
				player[play_num].animations.frame = 0+play_num;
			}
		}

		player[play_num].body.velocity.y *= 0.96;
		player[play_num].body.velocity.x *= 0.96;

	}

}

function controls_key(num){

	cursors = game.input.keyboard.createCursorKeys();
	test_one = 0;
	test_two = 0;

	if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ){
		if(special_active == 1){
			if(num_players == 0){
				fire(num,num);
			}else{
				if(num == 1){
					//fire(1);
				}
			}
		}else{
			if(game.players.getAt(num).alive == 1){
				fire(num, num);
				speed = 220;
			}
		}
	}else{
		speed = 300;
	}

	if ( game.input.keyboard.isDown(Phaser.Keyboard.A) ) {
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.x = -speed;
				if( player_combo.angle > -20 ){
					player_combo.angle -= 1;
				}
			}else{
				if(num == 0){
					player_combo.body.velocity.x = -speed;
					if( player_combo.angle > -20 ){
						player_combo.angle -= 1;
					}
				}
			}

		}else{
			if(game.players.getAt(num).alive == 1){
				player[num].body.velocity.x = -speed;

				if( player[num].angle > -20 ){
					player[num].angle -= 1;
				}
			}
		}
	}else if( game.input.keyboard.isDown(Phaser.Keyboard.D) ){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.x = speed;
				if( player_combo.angle < 20 ){
					player_combo.angle += 1;
				}
			}else{
				if(num == 0){
					player_combo.body.velocity.x = speed;
					if( player_combo.angle < 20 ){
						player_combo.angle += 1;
					}
				}
			}
		}else{
			if(game.players.getAt(num).alive == 1){
				player[num].body.velocity.x = speed;
				if( player[num].angle < 20 ){
					player[num].angle += 1;
				}
			}
		}
	}else{
		test_one = 1;
	}

	if ( game.input.keyboard.isDown(Phaser.Keyboard.W) ) {
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.y = -speed;
			}else{
				if(num == 0){
					player_combo.body.velocity.y = -speed;
				}
			}
		}else{
			if(game.players.getAt(num).alive == 1){
				player[num].body.velocity.y = -speed;
				//player.animations.play('forward');
				if(now_invincible[num] == 0){
					player[num].animations.frame = 8+num;
				}
			}
		}
	}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) ){
		if(special_active == 1){
			if(num_players == 0){
				player_combo.body.velocity.y = speed;
			}else{
				if(num == 0){
					player_combo.body.velocity.y = speed;
				}
			}
		}else{
			if(game.players.getAt(num).alive == 1){
				player[num].body.velocity.y = speed;
				//player.animations.play('back');
				if(now_invincible[num] == 0){
					player[num].animations.frame = 12+num;
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
			if(player[num].animations.frame != 0+num){
				player[num].animations.frame = 0+num;
			}
		}

		player[num].body.velocity.y *= 0.96;
		player[num].body.velocity.x *= 0.96;

	}
}


function combo_notice(num){
	value = 0;

	if(game.keyboard_offset == 1 && num == 0){
		if( game.input.keyboard.isDown(Phaser.Keyboard.E) ){
			//shine and noise
			if(game.players.countLiving() == num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}else{
		if(game.keyboard_offset == 1){ num = num-1;}
		if( pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
			//shine and noise
			if(game.players.countLiving() == num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}

	return value;
}

gameState.update = function (){

	//game.filter.update();

	//notice a player collects health
	game.physics.arcade.overlap(game.players, healths, pickup_health, null, this);

	//notice a player collects revive
	game.physics.arcade.overlap(game.players, lives, pickup_revive, null, this);

	game.physics.arcade.overlap(game.players, game.enemies, collision_notice, null, this);
	game.physics.arcade.collide(game.players, game.enemies, collision_notice, null, this);

	//game.physics.arcade.collide(enemies, enemies); //do we want overlap!

	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, game.enemies, add_point, null, this);

	//this is for a bit of fun players shoot move other players, may want to drop if resources are concern
	game.physics.arcade.collide(game.bulletPool, game.players, ricochet, null, this);


	all = 0;
	for (i = 0; i < num_players; i++) {
		//pad_connect_indicator(i);

		if(game.keyboard_offset == 1){
			if(!i == 0){
				controls_pad(i, (i-1));
			}else{
				controls_key(0);
			}
		}else{
			controls_pad(i , i);
		}

		if(special_active == 0){
			all = all+combo_notice(i);
		}

		if(now_invincible[i] == 1){
			player[i].animations.frame = 4+i;
		}

		if (nextKillAt[i] < game.time.now) {
			now_invincible[i] = 0;
		}
	}

	if(all == num_players){
		//console.log("merge"+all);
		value = game.players.countLiving();
		//console.log(value);

		//we need this visually
		//var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		//logo.anchor.setTo(0.5, 0.5);

		//combo health based on group health, complex i know
		player_combo.revive(10);

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

	if(development == 0){
		background.tilePosition.y += 1.2;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.P)){ pause();}

};

function ricochet(bullet, player){
	//console.log(bullet.body.velocity.x);
	//console.log(this.body.angle);

	bullet.body.velocity.x *= -1;
	bullet.body.velocity.y *= -1;

}

function flash(){
	game.flash.alpha = 1;
	game.add.tween(game.flash)
		.to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In)
		.start();
}

function shake(){
	game.camera.y = 0;
	game.add.tween(game.camera)
		.to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
		.start();
}

function add_point (bullet, enemy){
	//console.log(enemies.health);
	//console.log(bullet.name);
	//enemies.kill();

	bullet.kill();
	enemy.damage(1);
	/*
		//untill i sort out energy bars do not use this.
		console.log(bullet.name);
		player[bullet.name].energy = player[bullet.name].energy+1;
		console.log("test"+player[bullet.name].energy);
	*/

	//this need to check emeny dies and ensure its not adding more than 100!
	change = game.scorebars.getAt(bullet.name);
	//console.log(change.scale.y);
	change.scale.y = change.scale.y + 1;

	update_score(1);
}


function pickup_revive(player, lives){
	lives.kill();
	revive_player(lives); //this lives input may be an issue later
}

function revive_player(lives){
	if(game.players.countLiving() == num_players){
		return;
		recently_created = 0;
	}else{
		dead_player = game.players.getFirstDead();
		//move to appropriate position
		dead_player.x = lives.x;
		dead_player.y = lives.y;
		dead_player.revive(10);
		//need to trigger temp invincible
		recently_created = 0;
	}
}

function pickup_health(player, health) {
    // Removes the health from the screen
    health.kill();
	player.damage(-1);
	//console.log(players.health);
	//console.log(players.name);
	//console.log(players.z);

	change = game.healthbars.getAt(player.z-1);
	change.scale.y = player.health/5;

	update_score(1);
}

//this is not used yet
function lose_condition(){
	if(special_active == 0){
		if(game.players.countDead() == num_players){
			//lose game
		}
	}
}

function collision_notice(player, enemy) {
    // Removes the star from the screen
	//players.kill();
	num = game.players.z-1;
	if (nextKillAt[num] > game.time.now) {
		now_invincible[num] = 1;
	}else{
		now_invincible[num] = 0;
		nextKillAt[num] = game.time.now + KillDelay[num];

		player.damage(1);
		enemy.damage(1);

        shake();

		//this need functioning out
		change = game.healthbars.getAt(num);
		change.scale.y = player.health/5;
	}
}

function kill_players(player) {
	player.kill();
}

	return gameState;
};
