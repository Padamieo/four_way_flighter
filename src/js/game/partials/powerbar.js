var player = require('player');

var powerbar = function(game, i) {

	this.for_player = i;
	x = game.players.getAt(i).x;
	y = game.players.getAt(i).y;
	Phaser.Graphics.call(this, game, x, y);
	game.powerbars.add(this);

	this.fadeAt = 0;
	this.displayDelay = 1000;

};

// e_followers are a type of Phaser.Sprite
powerbar.prototype = Object.create(Phaser.Graphics.prototype);
powerbar.prototype.constructor = powerbar;

powerbar.prototype.update = function(game) {

	//there must be a better way to just lock these together
	//console.log("hello");
	game = this.game;
	this.clear();

	if(game.players.getAt(this.for_player).show_energy != 0){

		this.x = game.players.getAt(this.for_player).x;
		this.y = game.players.getAt(this.for_player).y;

		if(game.players.getAt(this.for_player).show_energy == 1){
			this.lineStyle(2, 0x00ff00, 1);
			game.players.getAt(this.for_player).show_energy = 2;
			this.fadeAt = game.time.now + this.displayDelay;

		}else{
			if (this.fadeAt > game.time.now) {
				this.lineStyle(2, 0x00ff00, 1);
			}else{
				game.players.getAt(this.for_player).show_energy = 0;
			}
		}

		value = player.energy_visual_value(game, this.for_player);
		start_point = game.math.degToRad(90);
		this.arc(0, 0, 35, start_point, value, false);

	}

};

module.exports = powerbar;
