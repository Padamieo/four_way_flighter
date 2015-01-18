
var powerbar = function(game, i) {

	this.for_player = i;

	x = game.avatar[i].x;
	y = game.avatar[i].y;

	Phaser.Graphics.call(this, game, x, y);

	game.powerbars.add(this);

};

// e_followers are a type of Phaser.Sprite
powerbar.prototype = Object.create(Phaser.Graphics.prototype);
powerbar.prototype.constructor = powerbar;

powerbar.prototype.update = function(game) {

	//there must be a better way to just lock these together
	game = this.game;
	this.x = game.avatar[this.for_player].x;
	this.y = game.avatar[this.for_player].y;

	this.clear();
	//this.lineStyle(2, 0x00ff00, 1);
	//value = player.health_visual_value(game, 0);
	//start_point = game.math.degToRad(90);
	//this.arc(0, 0, 40, start_point, value, false);


};

module.exports = powerbar;
