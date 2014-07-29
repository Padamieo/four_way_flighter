module.exports = function(game) {

	var menu = {};

	menu.preload = function () {
		game.num_players = 2;
		
		//bot = game.add.sprite(200, 200, 'switch');
		
		//game.input.onDown.add(changeMummy, this);
		button = game.add.button(200, 200, 'switch', actionOnClick, this);
		button.setFrames(0,1);
		game.stage.backgroundColor = '#565756';

		game.input.onDown.add(start_game, this);
	};
	
function actionOnClick (by) {

console.log(by.frame);
	if( by.frame == 0){
		by.setFrames(1);
	}else if( by.frame == 1){
	console.log('trig');
		by.setFrames(0);
	}
}
	function start_game(){
		game.state.start('game');
	}
	
	menu.create = function () {
		
	};
	
	return menu;
};
