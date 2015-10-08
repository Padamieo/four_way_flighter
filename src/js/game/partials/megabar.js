
//var player = require('player');  // why is this needed

// megabar constructor
var megabar = function(game) {

	console.log("create megabar");
	x = game.mega_zord.getAt(0).x;
	y = game.mega_zord.getAt(0).y;
	Phaser.Graphics.call(this, game, x, y);
	//game.megabar.add(this);


};

megabar.prototype = Object.create(Phaser.Graphics.prototype);
megabar.prototype.constructor = megabar;

megabar.prototype.update = function(game) {

	game = this.game;
	console.log("update megabar");
	//this.clear();
	this.lineStyle(2, 0x0ffff0, 1);
	this.x = game.mega_zord.getAt(0).x;
	this.y = game.mega_zord.getAt(0).y;

	value = player.energy_visual_value(game, 0);
	start_point = game.math.degToRad(90);
	this.arc(0, 0, 70, start_point, value, false);

};

module.exports = megabar;
