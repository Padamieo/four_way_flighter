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

	this.checkd = 0;
	this.checka = 0;
};

var cycle = function(char, pos_neg){
	if(pos_neg == 0){
		if(char.checka == 1){
			char.checka = 0;
			if(char.selected_colour != 0){
				char.selected_colour--;
			}else{
				char.selected_colour = 5;
			}
		}
	}else{
		if(char.checkd == 1){
			char.checkd = 0;
			if(char.selected_colour != 5){
				char.selected_colour++;
			}else{
				char.selected_colour = 0;
			}
		}
	}

};

character_menu.prototype = Object.create(Phaser.Sprite.prototype);
character_menu.prototype.constructor = character_menu;

character_menu.prototype.update = function(game) {

	if(this.i <= 3){
		if(this.game.input.gamepad.supported && this.game.input.gamepad.active){
			if(this.game.pad[this.i].connected) {
				if(this.assigned != 'N'){
					if ( this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 || this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
						this.checka = 1;
					}else{
						cycle(this, 0);
					}
					if (this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 || this.game.pad[this.i].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
						this.checkd = 1;
					}else{
						cycle(this, 1);
					}
					this.tint = this.game.player_colours[this.selected_colour];
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
			if(cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A) ){
				this.checka = 1;
			}else{
				cycle(this, 0);
			}
			if(cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D) ){
				this.checkd = 1;
			}else{
				cycle(this, 1);
			}
			this.tint = this.game.player_colours[this.selected_colour];
		}else{
			if ( this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ) {
				console.log("activated for"+this.i);
				this.assigned = 'K';
				this.alive = true;
			}
		}
	}

};

module.exports = character_menu;
