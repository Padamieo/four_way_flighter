var button = require('button');
var modal = require('modal');

var pause_modal = {

	setup: function(game){

		modal.cover(game, 0);

		// game.test = game.add.graphics(0, 0);
		// game.test.beginFill(0xffffff, 1);
		//w = game.width/3;
		// pw = game.width/2-w/2
		//h = game.height/1.5;
		// game.test.drawRect(pw, h/2, w, h);
		// game.test.endFill();
		// game.test.alpha = 0;

		// Add a input listener that can help us return from being paused
		game.input.onDown.add(pause_modal.unpause, self);
		//if(game.input.keyboard.isDown(Phaser.Keyboard.K)){ m.pause(game);}

		gunfire2 = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		gunfire2.onDown.add(pause_modal.pause, self);

		//gunfire = game.input.keyboard.addKey(Phaser.Keyboard.M);
		//gunfire.onDown.add(pause_modal.unpause, self);

		console.log("active");

	},

	button: function(text, x, y){

		game.button = game.add.graphics(0, 0);
		game.button.beginFill(0x00ffff, 1);
		game.button.drawRect(x, y, 120, 25);
		game.button.endFill();
		game.button.alpha = 1;

		game.button_label = game.add.text(25, 25, text, { font: '30px Arial', fill: '#fff' });
		game.button_label.anchor.setTo(0.5, 0.5);
		//v = game.button_label.length;
		//console.log(v);
		game.button_label.alpha = 1;

	},

	unpause: function(event){
		console.log("unpause press");
		game = event.game;
		if(game.paused){

			//Calculate the corners of the menu
			var x1 = game.width/2 - 270/2, x2 = game.width/2 + 270/2,
			  y1 = game.height/2 - 180/2, y2 = game.height/2 + 180/2;


			//event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2
			if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2){
				// // The choicemap is an array that will help us see which item was clicked
				// var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];
				// // Get menu local coordinates for the click
				// var x = event.x - x1,
				// y = event.y - y1;
				// // Calculate the choice
				// var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);
				// // Display the choice
				// choiseLabel.text = 'You chose menu item: ' + choisemap[choise];


			}else{
				//game.menu.destroy();
				// game.button.destroy();
				// game.choiseLabel.destroy();

				modal.cover(game, 2);
				//game.test.alpha = 0;
				game.paused = false;
			}
		}
	},

	pause: function(event) {
		game = event.game;

		console.log("unpause action");
		// When the pause button is pressed, we pause the game
		game.paused = true;
		// Then add the menu

	// w = game.width/2;
	// h = game.height/2;
	// game.menu = game.add.sprite(w, h, 'menu');
	// game.menu.anchor.setTo(0.5, 0.5);

		// pause_modal.button( 'poop', 100, 100);
		// game.test.alpha = 1;

	//	btn = new button(game, pause_modal.p);
		//button = new button.button(game);

		// And a label to illustrate which menu item was chosen. (This is not necessary)

		game.choiseLabel = game.add.text(game.width, game.height, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
		game.choiseLabel.anchor.setTo(0.5, 0.5);

		game.button2 = new button(game);

		// var para = document.createElement("a");
		// var node = document.createTextNode("This is new.");
		// para.appendChild(node);
		// var element = document.getElementById("game");
		// element.appendChild(para);

		//game.pause_background.alpha = 0.5;
		modal.cover(game, 1);

	}

};

module.exports = pause_modal;
