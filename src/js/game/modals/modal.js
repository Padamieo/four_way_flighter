var modal = {

	cover: function(game, i){
		if(i == 0){
			game.pause_background = game.add.graphics(0, 0);
			game.pause_background.beginFill(0x000000, 1);
			game.pause_background.drawRect(0, 0, game.width, game.height);
			game.pause_background.endFill();
			game.pause_background.alpha = 0;
		}else if(i == 1){
			game.pause_background.alpha = 0.5;
		}else{
			game.pause_background.alpha = 0;
		}

	}

};

module.exports = modal;
