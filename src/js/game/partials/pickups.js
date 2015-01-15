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

	this.anchor.setTo(0.5, 0.5);
	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.body.velocity.setTo(0, 100);

};

// e_followers are a type of Phaser.Sprite
pickup.prototype = Object.create(Phaser.Sprite.prototype);
pickup.prototype.constructor = pickup;


pickup.prototype.update = function(game) {

//console.log("testing"+game); // undefined
	/*
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
	*/

};


module.exports = pickup;
