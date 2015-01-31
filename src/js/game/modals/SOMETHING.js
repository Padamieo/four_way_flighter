
var character_menu = function(game, x, y, i) {

	posy = (game.height/2);
	posx = (game.width/5);
	if(i == 0){ posx = (posx/2); }else{ posx = posx*i+(posx/2); }

	Phaser.Sprite.call(this, game, posx, posy, 'box');
	game.characters.add(this);

	this.anchor.setTo(0.5, 0.5);
	this.assigned = 'N';
	this.i = i;

};

character_menu.prototype = Object.create(Phaser.Sprite.prototype);
character_menu.prototype.constructor = character_menu;

character_menu.prototype.update = function(game) {
	/*
	if(this.assigned == 'N'){
		//listend for pad or keyboard press
		game = this.game;
		for (i = 0; i < 4; i++){
			if(game.pad[i].isDown(Phaser.Gamepad.XBOX360_A)){
				console.log(i+"pad "+this.i+"player");
				this.assigned = i;
			}
		}
	}else{
		console.log(this.i+"pad "+this.assigned);
	}
	*/
};

module.exports = character_menu;
