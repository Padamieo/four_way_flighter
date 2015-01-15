// healthbar constructor
var healthbar = function(game) {


	//arc : http://docs.phaser.io/Phaser.Graphics.html
	this.graphic = game.add.graphics(game.world.centerX, game.world.centerY);

	this.graphic.lineStyle(2, 0xffff00, 0.7);

	value = game.math.degToRad(450); //450 is tol health

	start_point = game.math.degToRad(90);

	console.log(game.players);

	this.graphic.arc(0, 0, 50, start_point, value, false);

	//this.anchor.setTo(0.5, 0.5);

	this.player_to_follow = 0;

	//sprite.events.onRevived( doo,this);


};

// e_followers are a type of Phaser.Sprite
healthbar.prototype = Object.create(Phaser.Sprite.prototype);
healthbar.prototype.constructor = healthbar;


healthbar.prototype.update = function(game) {

	//needs to follow assigned player
	//also make invisible on
	this.player_to_follow = 0;

};


module.exports = healthbar;
