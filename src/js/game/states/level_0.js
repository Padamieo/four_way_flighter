var manager = require('manager');

module.exports = function(game) {

	var gameState = {};

	gameState.create = function () {
		manager.setup_level(game, 'level_0', '#5B91A8');
	};

	gameState.update = function (){
		manager.update_level(game);
	};

	return gameState;
};
