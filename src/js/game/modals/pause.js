var modal = {

	setup: function(game){

		// Create a white rectangle that we'll use to represent the flash
		game.pause_background = game.add.graphics(0, 0);
		game.pause_background.beginFill(0x000000, 1);
		game.pause_background.drawRect(0, 0, game.width, game.height);
		game.pause_background.endFill();
		game.pause_background.alpha = 0;

		game.test = game.add.graphics(0, 0);
		game.test.beginFill(0xffffff, 1);

		w = game.width/3;
		pw = game.width/2-w/2
		h = game.height/1.5;
		game.test.drawRect(pw, h/2.5, w, h);
		game.test.endFill();
		game.test.alpha = 0;

		// Add a input listener that can help us return from being paused
		game.input.onDown.add(modal.unpause, self);
	},

	unpause: function(event){
		game = event.game;
		if(game.paused){
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

			//}
			console.log(event.y);

			//game.menu.destroy();
			game.choiseLabel.destroy();
			game.pause_background.alpha = 0;
			game.test.alpha = 0;
			game.paused = false;
		}
	},

	pause: function(game) {
		// When the pause button is pressed, we pause the game
		game.paused = true;
		// Then add the menu

	// w = game.width/2;
	// h = game.height/2;
	// game.menu = game.add.sprite(w, h, 'menu');
	// game.menu.anchor.setTo(0.5, 0.5);
		game.test.alpha = 1;

		// And a label to illustrate which menu item was chosen. (This is not necessary)
		game.choiseLabel = game.add.text(w, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
		game.choiseLabel.anchor.setTo(0.5, 0.5);
		game.pause_background.alpha = 0.5;
	}

};

module.exports = modal;
