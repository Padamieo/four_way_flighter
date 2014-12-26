var e = require('e');

// e_basic constructor
var e_basic = function(game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'box');
	game.enemies.add(this);

	//sprite.events.onRevived( doo,this);
	
	this.events.onRevived.add(function(){this.health = 1}, this);
	this.events.onKilled.add(function(){e.explosion(game, this)}, this);

	game.next_e_ShotAt[this.z] = 0;
	game.e_shotDelay[this.z] = 1200;

	this.anchor.setTo(0.5, 0.5);

	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.health = 1;

	this.MAX_SPEED = 250;
	this.MIN_DISTANCE = 90;
};

// e_followers are a type of Phaser.Sprite
e_basic.prototype = Object.create(Phaser.Sprite.prototype);
e_basic.prototype.constructor = e_basic;

e_basic.prototype.update = function(game) {
	if(this.alive){
		e.fire(this.game, this, this.body.rotation);
		if(this.body.y < this.game.height+50){
			this.body.velocity.x = 0;
			this.body.velocity.y = 50;
			this.body.rotate += 1;
		}else{
			this.x = this.game.rnd.integerInRange(0, this.game.width);
			this.y = -50;
		}
	}
};

module.exports = e_basic;
