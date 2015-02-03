//var e = require('e'); // we will probably need player functions

var c = require('controls');

// avatar constructor
var avatar = function(game, i) {

	h = (game.height/2);
	w = (game.width/game.num_players+2);
	if(i == 0){ w = (w/2); }else{ w = w*i+(w/2); }

	Phaser.Sprite.call(this, game, w, h, 'fighter');
	game.physics.enable(this, Phaser.Physics.ARCADE);
	game.players.add(this);

	game.nextShotAt[i] = 0;
	game.shotDelay[i] = 70;

	game.nextKillAt[i] = 0;
	game.KillDelay[i] = 600

	//game.players.setAll('anchor.x', 0.5);
	//game.players.setAll('anchor.y', 0.5);
	this.anchor.setTo(0.5, 0.5);

	this.body.collideWorldBounds = true;
	this.name = i;
	this.pad = game.controls[i]; // needs to be set to pad id 1-4
	this.energy = 0;
	this.health = game.player_starting_health;
	this.show_health = 0;
	this.show_energy = 0;
	this.TOP_SPEED = 300;
	this.LOW_SPEED = 220;
	this.zoid_request = 0;
	this.fire_power = 1;
	//game.avatar[num].body.bounce.y=0.2;

	//game.avatar[num].body.immovable = false;
	//game.avatar[num].body.immovable = true;
	set = game.selected_colour[i];
	this.tint = game.player_colours[set];

	//this.animations.frame = i;

	//this is how we will control variouse screen resolutions
	this.scale.y = 1;
	this.scale.x = 1;

	// animations still usefull but not being used / set
	//game.avatar[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
	//game.avatar[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
	//game.avatar[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);

};

avatar.prototype = Object.create(Phaser.Sprite.prototype);
avatar.prototype.constructor = avatar;

avatar.prototype.update = function(game) {
	game = this.game;
	if(this.alive){

		if(this.zoid_request){console.log(this.name+"wants to zoid")}

		if(isNaN(game.controls[this.name])){
			if(game.controls[this.name] == 'K'){
				c.controls_key(game, this.name);
			}else{
				//custom controls
			}
		}else{
			c.controls_pad(game, this.name, this.pad);
			/**/
			//this needs to be functioned out
			v = game.pad[this.pad].buttonValue(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
			//console.log(v);
			if(v == 0 || v == null ){
				this.fire_power = 1;
				value = 0;
			}else{
				value = v*5;
				this.fire_power = value;
			}
			if (game.nextShotAt[this.name] > game.time.now) {
				return;
			}else{
				this.energy = (this.energy)-value;
				game.players.getAt(this.name).show_energy = 1;
			}
			/**/
		}

		if (game.nextKillAt[this.name] < game.time.now) {
			game.players.getAt(this.name).alpha = 1;
		}

	}else{
		//console.log(this.name+"alive");
		//we will need to make them visable for testing
	}
};

module.exports = avatar;
