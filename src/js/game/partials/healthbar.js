var player = require('player');

// healthbar constructor
var healthbar = function(game, i) {

	this.for_player = i;
	x = game.players.getAt(i).x;
	y = game.players.getAt(i).y;
	Phaser.Graphics.call(this, game, x, y);
	game.healthbars.add(this);

	this.fadeAt = 0;
	this.displayDelay = 2000;

	//this.sprite_tween = this.game.add.tween(this);
	//this.sprite_tween = this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Quartic.Out, false, 0, 0);
	//this.alpha = 0;
};

var test = function(graphic, game){
		console.log('oh hello'+graphic+" test"+test);
}

healthbar.prototype = Object.create(Phaser.Graphics.prototype);
healthbar.prototype.constructor = healthbar;

healthbar.prototype.update = function(game) {

	game = this.game;
	this.clear();

	if(game.players.getAt(this.for_player).show_health != 0){

		//there must be a better way to just lock these together
		this.x = game.players.getAt(this.for_player).x;
		this.y = game.players.getAt(this.for_player).y;

		if(game.players.getAt(this.for_player).show_health == 1){
			this.lineStyle(2, 0x00fff0, 1);
			game.players.getAt(this.for_player).show_health = 2;
			this.fadeAt = game.time.now + this.displayDelay;
			//console.log("fade at"+this.fadeAt+" gametime"+game.time.now);
			//this.alpha = 1;

		}else{
			if (this.fadeAt > game.time.now) {
				this.lineStyle(2, 0x00fff0, 1);
				//this.sprite_tween.start();
			}else{
				game.players.getAt(this.for_player).show_health = 0;
			}
		}

		value = player.health_visual_value(game, this.for_player);
		start_point = game.math.degToRad(90);
		this.arc(0, 0, 40, start_point, value, false);


	}

};

module.exports = healthbar;
