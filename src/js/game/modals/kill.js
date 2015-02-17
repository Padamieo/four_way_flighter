var modal = require('modal');

var kill_modal = {

	setup: function(game){

		modal.cover(game, 0);

		// Add a input listener that can help us return from being paused
		//game.input.onDown.add(kill_modal.unpause, self);
	},

	unpause: function(event){
		game = event.game;
		if(game.ended){
			// Calculate the corners of the menu
			//var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
			//   y1 = h/2 - 180/2, y2 = h/2 + 180/2;
			// Check if the click was inside the menu

			// if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
			// // The choicemap is an array that will help us see which item was clicked
			// var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];
			// // Get menu local coordinates for the click
			// var x = event.x - x1,
			// y = event.y - y1;
			// // Calculate the choice
			// var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);
			// // Display the choice
			// choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
			// }
			// else{
			// // Remove the menu and the label
			game.menu.destroy();
			game.choiseLabel.destroy();

			modal.cover(game, 2);

			game.ended = false;
			//}
		}
	},

	ill_screen: function(game) {
		// When the pause button is pressed, we pause the game
		game.ended = true;
		// Then add the menu
		w = game.width/2;
		h = game.height/2;
		game.menu = game.add.sprite(w, h, 'menu');
		game.menu.anchor.setTo(0.5, 0.5);
		// And a label to illustrate which menu item was chosen. (This is not necessary)
		game.choiseLabel = game.add.text(w, h-150, 'YOU DEAD!', { font: '30px Arial', fill: '#fff' });
		game.choiseLabel.anchor.setTo(0.5, 0.5);

		modal.cover(game, 1);
	}

};

module.exports = kill_modal;
