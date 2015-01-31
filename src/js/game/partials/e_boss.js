var e = require('e');
var g = require('general');

// e_basic constructor
var e_basic = function(game, type) {

	//x = game.rnd.integerInRange(0, game.width);
	//y = game.rnd.integerInRange(0, -(game.height));
	Phaser.Sprite.call(this, game, x, y, 'box');
	game.enemies.add(this);

	//this.events.onRevived.add(function(){test(this.game, this)}, this);
	//this.events.onRevived.add(function(){nme.health = 1;}, this);
	this.events.onKilled.add(function(){ e.explosion(game, this)}, this);

	game.next_e_ShotAt[this.z] = 0;
	game.e_shotDelay[this.z] = 150;

	this.anchor.setTo(0.5, 0.5);

	this.scale.y = 4;
	this.scale.x = 4;

	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.health = 350;
	this.MAX_SPEED = 100;
	this.MIN_DISTANCE = 90;
	this.kill_point = 100;
	this.ref = 0;
};

var test = function(game, nme){
	console.log("hello");
	nme.health = 1;
	//x = game.rnd.integerInRange(0, game.width);
	//y = game.rnd.integerInRange(0, -(game.height)+50);
}

// e_followers are a type of Phaser.Sprite
e_basic.prototype = Object.create(Phaser.Sprite.prototype);
e_basic.prototype.constructor = e_basic;

e_basic.prototype.update = function(game) {
	if(this.alive){
			n = this.ref
			if(n == 360){
				this.ref = 0;
			}else{
				this.ref = this.ref+1;
			}
			v = this.game.math.degToRad(n);
			e.fire(this.game, this, v);

		if(this.body.y < this.game.height+50){
			this.body.velocity.x = 0;
			this.body.velocity.y = 10;
			this.body.rotate += 1;
		}else{
			this.x = this.game.rnd.integerInRange(0, this.game.width);
			this.y = -50;
		}
	}
};

module.exports = e_basic;
