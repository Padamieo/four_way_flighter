var e = require('e');

var e_follower = function(game, type) {

	Phaser.Sprite.call(this, game, x, y, 'e_follow');
	game.enemies.add(this);

	target = e.random_alive_player(game);
	this.TARGET = target;

	// Set the pivot point for this sprite to the center
	this.anchor.setTo(0.5, 0.5);

	this.health = 2;

	this.events.onRevived.add(function(){ alive(game, this)}, this);
	this.events.onKilled.add(function(){ e.explosion(game, this)}, this);

	//this.enableBody = true;
	//this.physicsBodyType = Phaser.Physics.ARCADE;

	// Enable physics on this object
	this.game.physics.enable(this, Phaser.Physics.ARCADE);

	// Define constants that affect motion
	this.MAX_SPEED = 250; // pixels/second
	this.type = type;
	this.MIN_DISTANCE = 90; // pixels
	this.kill_point = 1;

	this.tint = '0x999999';
};

var alive = function(game, nme){
	nme.health = 2;
	nme.tint = '0x999999';
}

var follow = function(nme, pos){
	// Calculate the angle to the target
	var rotation = this.game.math.angleBetween(nme.x, nme.y, pos[0], pos[1]);
	// Calculate velocity vector based on rotation and this.MAX_SPEED
	nme.body.velocity.x = Math.cos(rotation) * nme.MAX_SPEED;
	nme.body.velocity.y = Math.sin(rotation) * nme.MAX_SPEED;
	//this.body.angle -= 10;

}

// e_followers are a type of Phaser.Sprite
e_follower.prototype = Object.create(Phaser.Sprite.prototype);
e_follower.prototype.constructor = e_follower;


e_follower.prototype.update = function() {

	// Calculate distance to target
	pos = e.choose_player_target(this.game, this, this.TARGET);
	var distance = this.game.math.distance(this.x, this.y, pos[0], pos[1]);

	if (distance > this.MIN_DISTANCE) {
		follow(this, pos);
	} else {
		if(type == 5){
			follow(this, pos);
		}else{
			this.body.velocity.setTo(0, 0);
		}
	}

};

module.exports = e_follower;
