module.exports = function(game) {
	var background;
	var pos = [];
	
	var score = 0;
	var scoreText;
	var count = 0; // this should probably be game.count
	
	var num_players;
	var players; //not needed but was trying to resolve group issue
	var player = [];
	var pad = [];
	//var indicator = [];
	var nextShotAt = [];
	var shotDelay = [];
	
	var nextKillAt = [];
	var KillDelay = [];
	
	var enemies;
	var next_e_ShotAt = [];
	var e_shotDelay = [];

	var lives;
	var recently_created = 0;
	
	var now_invincible = [];
	var special_active = 0;
	
	var development = 1;
	
	var gameState = {};

gameState.create = function () {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
	
	generate();
	
	//game.filter = game.add.filter('Fire', game.width, game.height);

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
	players.forEachAlive( check_health, this);
	game.starting_group_health = game.cal_health;
	
	//scorebars
	game.scorebars = game.add.group();
	for (i = 0; i < num_players; i++) {
		if(i == 0){ x = 5;}
		if(i == 1){ x = (game.width-5); }
		if(i == 2) { x = (game.width/4);}
		if(i == 3){ x = (game.width-(game.width/4)); }
		console.log("this"+x);
		
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
	enemies = game.add.group();
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

//////////////////////
// ENEMIES
//////////////////////
// e_follower constructor
var e_follower = function(game, x, y) {
    
	Phaser.Sprite.call(this, game, x, y, 'e_follow');
	enemies.add(this);

	target = random_alive_player();
    this.TARGET = target;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
	
	this.events.onRevived.add(function(){this.health = 2}, this);
	this.health = 2;
	
	//this.enableBody = true;
	//this.physicsBodyType = Phaser.Physics.ARCADE;
	
    // Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 90; // pixels
};

// e_followers are a type of Phaser.Sprite
e_follower.prototype = Object.create(Phaser.Sprite.prototype);
e_follower.prototype.constructor = e_follower;


e_follower.prototype.update = function() {

    // Calculate distance to target
	pos = choose_player_target(this, this.TARGET);
	var distance = this.game.math.distance(this.x, this.y, pos[0], pos[1]);
	
    // If the distance > MIN_DISTANCE then move
    if (distance > this.MIN_DISTANCE) {
        // Calculate the angle to the target
        var rotation = this.game.math.angleBetween(this.x, this.y, pos[0], pos[1]);

        // Calculate velocity vector based on rotation and this.MAX_SPEED
        this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
        this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
		//this.body.angle -= 10;
    } else {
        this.body.velocity.setTo(0, 0);
    }
};

function doSomething(){
	this.health = 20;
}
// e_basic constructor
var e_basic = function(game, x, y) {
	
	Phaser.Sprite.call(this, game, x, y, 'box');
	enemies.add(this);
	
	//sprite.events.onRevived( doo,this);
	
	this.events.onRevived.add(function(){this.health = 1}, this);
	this.events.onKilled.add(function(){explosion(this)}, this);
	
	next_e_ShotAt[this.z] = 0;
	e_shotDelay[this.z] = 1200;
	
    this.anchor.setTo(0.5, 0.5);

    game.physics.enable(this, Phaser.Physics.ARCADE);
	
	this.health = 1;
	
    this.MAX_SPEED = 250;
    this.MIN_DISTANCE = 90;
};

// e_followers are a type of Phaser.Sprite
e_basic.prototype = Object.create(Phaser.Sprite.prototype);
e_basic.prototype.constructor = e_basic;

e_basic.prototype.update = function() {
	if(this.alive){
		e_fire(this, this.body.rotation);
		if(this.body.y < game.height+50){
			this.body.velocity.x = 0;
			this.body.velocity.y = 50;
			this.body.rotate += 1;
		}else{
			this.x = game.rnd.integerInRange(0, game.width);
			this.y = -50;
		}
	}
};

// Missile constructor
var e_missile = function(game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'e_swift');
	
	enemies.add(this);
	//console.log(this.z+"m");
	next_e_ShotAt[this.z] = 0;
	e_shotDelay[this.z] = 400;
	game.stuck_on_path = 0;
	
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
	
	this.events.onRevived.add(function(){this.health = 4}, this);
	this.health = 4;
    // Enable physics on the missile
    game.physics.enable(this, Phaser.Physics.ARCADE);

	target = random_alive_player();
	this.TARGET = target;//select random alive target
	
	this.RANDOM_X = game.rnd.integerInRange(-100, game.width+100);
	this.RANDOM_Y = -30;//game.rnd.integerInRange(0, game.height);

    // Define constants that affect motion
    this.SPEED = 295; // missile speed pixels/second
    this.TURN_RATE = 2; // turn rate in degrees/frame
	this.MIN_DISTANCE = 150;
	this.MAX_DISTANCE = 300;	
};

// Missiles are a type of Phaser.Sprite
e_missile.prototype = Object.create(Phaser.Sprite.prototype);
e_missile.prototype.constructor = e_missile;

e_missile.prototype.update = function() {
    // Calculate the angle from the e_missile to the mouse cursor game.input.x
    // and game.input.y are the mouse position; substitute with whatever
    // target coordinates you need.
	if(this.alive){
		
		if( game.stuck_on_path == 0){
			pos = choose_player_target(this, this.TARGET);
			var distance = this.game.math.distance(this.x, this.y, pos[0], pos[1]);
			var targetAngle = this.game.math.angleBetween(
				this.x, this.y,
				pos[0], pos[1]
			);
		}
	
		if( game.stuck_on_path == 1){
			var distance = this.game.math.distance(this.x, this.y, this.RANDOM_X, this.RANDOM_Y);
			var targetAngle = this.game.math.angleBetween(
				this.x, this.y,
				this.RANDOM_X, this.RANDOM_Y
			);
		}
	
		if (distance < this.MIN_DISTANCE) {
			game.stuck_on_path = 1;
		}else if(distance < this.MAX_DISTANCE){
			game.stuck_on_path = 0;
		}
	
		// Gradually (this.TURN_RATE) aim the e_missile towards the target angle
		if (this.rotation !== targetAngle) {
			//console.log(this.z+"aiming at");
			// Calculate difference between the current angle and targetAngle
			var delta = targetAngle - this.rotation;

			// Keep it in range from -180 to 180 to make the most efficient turns.
			if (delta > Math.PI) delta -= Math.PI * 2;
			if (delta < -Math.PI) delta += Math.PI * 2;

			if (delta > 0) {
				// Turn clockwise
				this.angle += this.TURN_RATE;
			} else {
				// Turn counter-clockwise
				this.angle -= this.TURN_RATE;
			}

			// Just set angle to target angle if they are close
			if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
				this.rotation = targetAngle;
				e_fire(this, targetAngle);
			}
		}
		// Calculate velocity vector based on this.rotation and this.SPEED
		this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
		this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
	}
};


function choose_player_target(enemy, target){	
	if(players.getAt(target).alive){
		x = players.getAt(target).x;
		y = players.getAt(target).y;
	}else if(player_combo.alive){
		x = player_combo.x;
		y = player_combo.y;
	}else{
		if(players.countDead() == num_players){
			rl = random_location();
			x = rl[0];
			y = rl[1];
		}else{
			rdn_target = random_alive_player();
			x = players.getAt(rdn_target).x;
			y = players.getAt(rdn_target).y;
			enemy.TARGET = rdn_target;
		}		
	}
	x = Math.floor(x);
	y = Math.floor(y);
	var arr = new Array(x, y); 
	return arr;
}

function random_location(){
	x = game.rnd.integerInRange(0, game.width);
	y = game.rnd.integerInRange(0, game.height);
	var arr = new Array(x, y); 
	return arr;
}

function random_alive_player(){
	num_alive = players.countLiving();
	rnd_target = game.rnd.integerInRange(0, num_alive);
	return rnd_target;
}

	function e_fire(e, targetAngle){
		//console.log("fire"+e.z);
		if (next_e_ShotAt[e.z] > game.time.now) {
			return;
		}
		next_e_ShotAt[e.z] = game.time.now + e_shotDelay[e.z];
		if (game.e_bulletPool.countDead() === 0) {
			return;
		}
		
		e_bullet = game.e_bulletPool.getFirstExists(false);
		e_bullet.reset(e.x, e.y, 'bullet');
		
		//e_bullet.body.animations.frame = 2; //needs to set bullet colour on who fired
		
		e_bullet.rotation = targetAngle;
		e_bullet.SPEED = 400;
		e_bullet.body.velocity.x = Math.cos(e_bullet.rotation) * e_bullet.SPEED;
		e_bullet.body.velocity.y = Math.sin(e_bullet.rotation) * e_bullet.SPEED;	
	}
	
	function explosion(loc){
		if (game.explosion.countDead() === 0) {
			return;
		}
		bang = game.explosion.getFirstExists(false);
		//bang.rotation = 180;
		bang.reset(loc.x, loc.y);
		bang.play('boom', 30, 1, true);
		
		
	}

	function player_setup(num){
		pos = (game.height/3);
		pos2 = (game.width/num_players+2);
		if(num == 0){ pos2 = (pos2/2)-5; }else{ pos2 = pos2*num+(pos2/2)-5; }
		
		player[num] = players.create(pos2, pos*2, 'dude');
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
		for (i = 0; i < 3; i++) {
			element = game.rnd.integerInRange(1, 9);
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

		if (enemies.countLiving() < 1) {
			
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
			
			var nme = enemies.getFirstDead();
			if (nme === null) {
				nme = new e_follower(game, 0, 0);
			}
			
		}else if(type == 2){

			var nme = enemies.getFirstDead();
			if (nme === null) {
				nme = new e_missile(game, 0, 0);
			}
			
		}else{

			var nme = enemies.getFirstDead();
			if (nme === null) {
				nme = new e_basic(game, 0, 0);
			}

		}

		nme.revive(nme.health);

		nme.x = x;
		nme.y = y;

		return nme;
	};

	
	function add_revive(){
		if(players.countLiving() != num_players && recently_created != 1){
			live = lives.create(game.world.randomX, -30, 'live');
			live.body.velocity.setTo(0, 100);
			recently_created = 1;
		}
	}
	
	function add_health(){
		
		health_threshold = (game.starting_group_health/4);
		
		game.cal_health = 0;
		players.forEachAlive( check_health, this);
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
			if(players.getAt(play_num).alive == 1){
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
			if(players.getAt(play_num).alive == 1){
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
			if(players.getAt(play_num).alive == 1){
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
			if(players.getAt(play_num).alive == 1){
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
			if(players.getAt(play_num).alive == 1){
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
			if(players.getAt(num).alive == 1){
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
			if(players.getAt(num).alive == 1){
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
			if(players.getAt(num).alive == 1){
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
			if(players.getAt(num).alive == 1){
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
			if(players.getAt(num).alive == 1){
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
			if(players.countLiving() == num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}else{
		if(game.keyboard_offset == 1){ num = num-1;}
		if( pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
			//shine and noise
			if(players.countLiving() == num_players){
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
	game.physics.arcade.overlap(players, healths, pickup_health, null, this);
	
	//notice a player collects revive
	game.physics.arcade.overlap(players, lives, pickup_revive, null, this);
	
	game.physics.arcade.overlap(players, enemies, collision_notice, null, this);
	game.physics.arcade.collide(players, enemies, collision_notice, null, this);
	
	//game.physics.arcade.collide(enemies, enemies); //do we want overlap!
	
	//this is just for registering who shot what
	game.physics.arcade.overlap(game.bulletPool, enemies, add_point, null, this);
	
	//this is for a bit of fun players shoot move other players, may want to drop if resources are concern
	game.physics.arcade.collide(game.bulletPool, players, ricochet, null, this);
	
	
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
		value = players.countLiving();
		//console.log(value);
		
		//we need this visually
		//var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		//logo.anchor.setTo(0.5, 0.5);
		
		//combo health based on group health, complex i know
		player_combo.revive(10);
		
		//would be nice to animate joining in center
		//players.forEach(game.physics.arcade.moveToObject, this, this, logo);
		players.forEach( kill_players, this, true);
		
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
	console.log(bullet.body.velocity.x);
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

function add_point (bullet, enemies){
	//console.log(enemies.health);
	//console.log(bullet.name);
	//enemies.kill();
	
	bullet.kill();
	enemies.damage(1);
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

function pickup_health(players, health) {
    // Removes the health from the screen
    health.kill();
	players.damage(-1);
	//console.log(players.health);
	//console.log(players.name);
	//console.log(players.z);
	
	change = game.healthbars.getAt(players.z-1);
	change.scale.y = players.health/5;
	
	update_score(1);
}

//this is not used yet
function lose_condition(){
	if(special_active == 0){
		if(players.countDead() == num_players){
			//lose game
		}
	}
}

function collision_notice(players, enemies) {
    // Removes the star from the screen
	//players.kill();
	num = players.z-1;
	if (nextKillAt[num] > game.time.now) {
		now_invincible[num] = 1;
	}else{
		now_invincible[num] = 0;
		nextKillAt[num] = game.time.now + KillDelay[num];
		
		players.damage(1);
		enemies.damage(1);

        shake();
		
		//this need functioning out
		change = game.healthbars.getAt(num);
		change.scale.y = players.health/5;
	}
}

function kill_players(players) {
	players.kill();
}

	return gameState;
};
