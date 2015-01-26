
var character_menu = function(game, x, y, i) {

	posy = (game.height/2);
	posx = (game.width/2);

	Phaser.Sprite.call(this, game, posx, posy, 'box');
	game.characters.add(this);

	this.anchor.setTo(0.5, 0.5);

};

character_menu.prototype = Object.create(Phaser.Sprite.prototype);
character_menu.prototype.constructor = character_menu;

character_menu.prototype.update = function(game) {

};

module.exports = character_menu;
