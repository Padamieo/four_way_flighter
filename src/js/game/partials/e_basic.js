var e = require('e');
var g = require('general');

// e_basic constructor
var e_basic = function(game, type) {

	x = game.rnd.integerInRange(0, game.width);

	y = game.rnd.integerInRange(0, -(game.height));
	console.log(y);
	Phaser.Sprite.call(this, game, x, y, 'box');
	game.enemies.add(this);

	//sprite.events.onRevived( doo,this);

	this.events.onRevived.add(function(){test(this.game, this)}, this);
	this.events.onKilled.add(function(){ e.explosion(game, this)}, this);

	game.next_e_ShotAt[this.z] = 0;
	game.e_shotDelay[this.z] = 1400;

	this.anchor.setTo(0.5, 0.5);

	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.health = 1;
	this.type = type;
	this.MAX_SPEED = 250;
	this.MIN_DISTANCE = 90;
	this.kill_point = type+1;
};

var test = function(game, nme){
	console.log("hello");
	nme.health = 1;
	x = game.width/2;
	y = game.height/2;
}

// e_followers are a type of Phaser.Sprite
e_basic.prototype = Object.create(Phaser.Sprite.prototype);
e_basic.prototype.constructor = e_basic;

e_basic.prototype.update = function(game) {
	if(this.alive){
		if(this.type != 0){
			v = this.game.math.degToRad(90);
			e.fire(this.game, this, v);
		}
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
