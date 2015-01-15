// healthbar constructor
var powerbar = function(game, i) {

	this.for_player = i;

	x = game.avatar[i].x;
	y = game.avatar[i].y;

	Phaser.Graphics.call(this, game, x, y);

	game.healthbars.add(this);

	this.lineStyle(3, 0xffff00, 0.5);

	value = game.math.degToRad(450); //450 is tol health

	start_point = game.math.degToRad(90);

	this.arc(0, 0, 32, start_point, value, false);

};

// e_followers are a type of Phaser.Sprite
powerbar.prototype = Object.create(Phaser.Graphics.prototype);
powerbar.prototype.constructor = powerbar;

powerbar.prototype.update = function(game) {

	//there must be a better way to just lock these together
	game = this.game;
	this.x = game.avatar[this.for_player].x;
	this.y = game.avatar[this.for_player].y;

};

module.exports = powerbar;
