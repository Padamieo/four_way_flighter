module.exports = function(game) {

	var menu = {};

	menu.preload = function () {
		game.num_players = 2;
		
		game.stage.backgroundColor = '#565756';
		
		game.input.onDown.add(start_game, this);
	};

	function start_game(){
		game.state.start('game');
	}
	
	menu.create = function () {
		
	};
	
	return menu;
};
