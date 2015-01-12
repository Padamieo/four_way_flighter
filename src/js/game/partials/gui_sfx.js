var u = {

	setup_healthbars: function(player){
		//health bars position currently 1342
		game.healthbars = game.add.group();
		for (i = 0; i < game.num_players; i++) {
			if(i == 0){ x = 5;}
			if(i == 1){ x = (game.width-5); }
			if(i == 2) { x = (game.width/4);}
			if(i == 3){ x = (game.width-(game.width/4)); }
			game.healthbar = game.healthbars.create(x,  game.height-5, 'health_bar');
			if(i == 0 || i == 2){
				game.healthbar.anchor.x=0;
				game.healthbar.anchor.y=1;
			}else{
				game.healthbar.anchor.x=1;
				game.healthbar.anchor.y=1;
			}
			//set initial height
			change = game.healthbars.getAt(i);
			change.scale.y = player[i].health/5;
		}

	}

};

module.exports = u;
