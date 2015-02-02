var modal = {

	setup: function(game){

		// Create a white rectangle that we'll use to represent the flash
		game.ended_background = game.add.graphics(0, 0);
		game.ended_background.beginFill(0x000000, 1);
		game.ended_background.drawRect(0, 0, game.width, game.height);
		game.ended_background.endFill();
		game.ended_background.alpha = 0;

		// Add a input listener that can help us return from being paused
		//game.input.onDown.add(modal.unpause, self);
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
			game.ended_background.alpha = 0;
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
		game.ended_background.alpha = 0.5;
	}

};

module.exports = modal;