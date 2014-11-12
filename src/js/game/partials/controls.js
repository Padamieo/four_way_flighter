
function combo_notice(num){
	value = 0;

	if(game.keyboard_offset == 1 && num == 0){
		if( game.input.keyboard.isDown(Phaser.Keyboard.E) ){
			//shine and noise
			if(players.countLiving() == num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}else{
		if(game.keyboard_offset == 1){ num = num-1;}
		if( pad[num].isDown(Phaser.Gamepad.XBOX360_A) ){
			//shine and noise
			if(players.countLiving() == num_players){
				//also check they have engouth juice and more than 50 health
					value = 1;
			}
		}
	}
	
	return value;
}