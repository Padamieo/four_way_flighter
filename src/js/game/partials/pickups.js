// pickup constructor
var pickup = function(game, type) {

	this.class = type;

	if(type == 0){
		type_img = 'health';
	}else{
		type_img = 'live';
	}

	Phaser.Sprite.call(this, game, game.world.randomX, 50, type_img);
	game.pickups.add(this);

	this.events.onRevived.add(function(){this.y = 50;}, this);

	this.anchor.setTo(0.5, 0.5);
	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.outOfBoundsKill = true;
	this.checkWorldBounds = true;

	this.body.velocity.setTo(0, 100);
};

pickup.prototype = Object.create(Phaser.Sprite.prototype);
pickup.prototype.constructor = pickup;

pickup.prototype.update = function(game) {

};

module.exports = pickup;
