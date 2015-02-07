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
	this.selected_colour = 0;
	this.tint ='0xffffff';
};

character_menu.prototype = Object.create(Phaser.Sprite.prototype);
character_menu.prototype.constructor = character_menu;

character_menu.prototype.update = function(game) {

	if(this.i <= 3){
		if(this.game.input.gamepad.supported && this.game.input.gamepad.active){
			if(this.game.pad[this.i].connected) {
				if(this.assigned != 'N'){

				//	return;
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

		//	return;
		}else{
			if ( this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ) {
				console.log("activated for"+this.i);
				this.assigned = 'K';
				this.alive = true;
			}
		}
	}

	if(this.assigned != 'N'){
		if(this.assigned == 'K'){

			if(cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A) ){
				if(this.selected_colour != 0){
					this.selected_colour--;
				}
			}

			if(cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D) ){
				if(this.selected_colour != 5){
					this.selected_colour++;
				}
			}
			console.log(this.selected_colour);

		}else{
			if ( this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 || this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
				if(this.selected_colour != 0){
					this.selected_colour--;
				}
			}else if (this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 || this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
				if(this.selected_colour != 5){
					this.selected_colour++;
				}
			}
		}

		this.tint = this.game.player_colours[this.selected_colour];
	}

};

module.exports = character_menu;
