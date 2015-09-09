
var button = function(game, callback) {

	//Phaser.Sprite.call(this, game, x, y, 'box');
	//game.buttons.add(this);

	game.button = game.add.graphics(0, 0);
	game.button.beginFill(0x00ffff, 1);
	game.button.drawRect(100, 100, 120, 25);
	game.button.endFill();
	game.button.alpha = 1;

	//game.cache.addBitmapData("ttt", game.button);

	//this.anchor.setTo(0.5, 0.5);
	//Phaser.Button.call(this, game, 300, 300, game.button);

	game.buttonlabel = game.add.text(w, h, 'buttons label', { font: '30px Arial', fill: '#fff' });
	game.buttonlabel.anchor.setTo(0.5, 0.5);

};

var d = function(){
	consoel.log("pressed");
}

button.prototype = Object.create(Phaser.Sprite.prototype);
button.prototype.constructor = button;

button.prototype.update = function(game) {

};

module.exports = button;
