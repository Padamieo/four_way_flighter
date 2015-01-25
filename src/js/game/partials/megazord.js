var c = require('controls');

// megazord constructor
var megazord = function(game) {
	x = game.width/2;
	y = game.height/2;
	Phaser.Sprite.call(this, game, x, y, 'fighter');
	game.physics.enable(this, Phaser.Physics.ARCADE);
	game.mega_zord.add(this);

	// game.nextShotAt[i] = 0;
	// game.shotDelay[i] = 50;
	//
	// game.nextKillAt[i] = 0;
	// game.KillDelay[i] = 600

	this.anchor.setTo(0.5, 0.5);

	this.body.collideWorldBounds = true;
	//this.name = megazord;

	this.energy = 0;
	//this.health = game.player_starting_health;
	//this.show_health = 0;

	this.TOP_SPEED = 300;
	this.LOW_SPEED = 220;
	//game.megazord[num].body.bounce.y=0.2;

	//game.megazord[num].body.immovable = false;
	//game.megazord[num].body.immovable = true;

	this.tint = 0xff00ff;

	//this.animations.frame = i;

	//this is how we will control variouse screen resolutions
	this.scale.y = 5;
	this.scale.x = 5;

	// animations still usefull but not being used / set
	//game.megazord[num].animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
	//game.megazord[num].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
	//game.megazord[num].animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);

};

megazord.prototype = Object.create(Phaser.Sprite.prototype);
megazord.prototype.constructor = megazord;

megazord.prototype.update = function(game) {

	game = this.game;
	if(this.alive){

	}else{
		//console.log(this.name+"alive");
		//we will need to make them visable for testing
	}
	
};

module.exports = megazord;
