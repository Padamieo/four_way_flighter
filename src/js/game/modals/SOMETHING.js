var character_menu = function(game, x, y, i) {

	posy = (game.height/2);
	posx = (game.width/5);
	if(i == 0){ posx = (posx/2); }else{ posx = posx*i+(posx/2); }

	Phaser.Sprite.call(this, game, posx, posy, 'box');
	game.characters.add(this);

	this.anchor.setTo(0.5, 0.5);
	this.assigned = 'N';
	this.i = i;
	this.alive = 0;
	this.tint ='0xff00ff';
};

character_menu.prototype = Object.create(Phaser.Sprite.prototype);
character_menu.prototype.constructor = character_menu;

character_menu.prototype.update = function(game) {

	if(this.i <= 3){
		if(this.game.input.gamepad.supported && this.game.input.gamepad.active){
			if(this.game.pad[this.i].connected) {
				if(this.assigned != 'N'){
					return;
				}else{
					if( this.game.pad[this.i].isDown(Phaser.Gamepad.XBOX360_A) ){
						console.log("activated for"+this.i);
						this.assigned = this.i;
						this.alive = true;
					}
				}
			}
		}
	}else{
		if(this.assigned != 'N'){
			return;
		}else{
			if ( this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ) {
				console.log("activated for"+this.i);
				this.assigned = 'K';
				this.alive = true;
			}
		}
	}


	if(this.assigned == 'N'){
		this.tint = '0xffffff';
	}else{
		this.tint = '0x0000ff';
	}

};

module.exports = character_menu;
