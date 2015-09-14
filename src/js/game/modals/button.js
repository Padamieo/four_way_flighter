
var button = function(game, callback) {

	//Phaser.Sprite.call(this, game, x, y, 'box');
	//game.buttons.add(this);

	button = game.add.graphics(0, 0);
	button.beginFill(0x00ffff, 1);
	button.drawRect(100, 100, 120, 25);
	button.endFill();
	button.alpha = 1;

	//game.cache.addBitmapData("ttt", game.button);
	button_x_pos = game.rnd.integerInRange(game.world.centerX - 130, game.world.centerX + 130);
	button_y_pos = game.rnd.integerInRange(game.world.centerY - 100, game.world.centerY + 100);
//game.world.centerX
	button = game.add.button(button_x_pos, button_y_pos , button, actionOnClick, this, 2, 1, 0);

	//game.buttonlabel = game.add.text(w, h, 'buttons label', { font: '30px Arial', fill: '#fff' });
	//game.buttonlabel.anchor.setTo(0.5, 0.5);

	//this.events.onInputOver.add(over, this);
	//game.buttonlabel.events.onInputOut.add(out, this);


};

var d = function(){
	console.log("pressed");
}

var over = function(that){
this.alpha = 0.5;
	console.log("over");
}

var actionOnClick = function(that){
	that.alpha = 0.5;
	console.log("over");
}

button.prototype = Object.create(Phaser.Sprite.prototype);
button.prototype.constructor = button;

button.prototype.update = function(game) {
	game.buttonlabel.events.onInputOver.add(over, this);
};

module.exports = button;
