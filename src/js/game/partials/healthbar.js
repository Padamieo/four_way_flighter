var player = require('player');

// healthbar constructor
var healthbar = function(game, i) {

	this.for_player = i;

	//x = game.player.get[i].x;
	x = game.players.getAt(i).x;
	y = game.players.getAt(i).y;

	Phaser.Graphics.call(this, game, x, y);

	game.healthbars.add(this);
};

var test = function(graphic, test){
		console.log('oh hello'+graphic+" test"+test);

}

healthbar.prototype = Object.create(Phaser.Graphics.prototype);
healthbar.prototype.constructor = healthbar;

healthbar.prototype.update = function(game) {
	game = this.game;
	this.clear();

	//game.players.forEach( kill_players, this, true);

	//game.players.forEachAlive(test, this, this.for_player);

	if(game.players.getAt(this.for_player).show_health != 0){
		
		//there must be a better way to just lock these together
		this.x = game.players.getAt(this.for_player).x;
		this.y = game.players.getAt(this.for_player).y;

		this.lineStyle(2, 0x00fff0, 1);
		value = player.health_visual_value(game, this.for_player);
		start_point = game.math.degToRad(90);
		this.arc(0, 0, 40, start_point, value, false);
	}



};

module.exports = healthbar;
