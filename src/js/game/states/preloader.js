module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    //game.load.image('logo', 'images/test.svg#grunt-cache-bust', '500', '240');
	
	game.load.spritesheet('switch', 'images/switch.jpeg', 32, 32);
	game.load.image('sky', 'images/sky.png');
	
    game.load.image('star', 'images/star.png');
	
	game.load.image('health', 'images/health.png');
	game.load.image('live', 'images/live.png');
    game.load.spritesheet('dude', 'images/fighter.svg', 32, 48);
	
	game.load.spritesheet('controllers', 'images/controllers.png', 260, 107);
	
	game.load.image('health_bar', 'images/healthbar.png');
	
	game.load.image('box', 'images/enemy.png');
	game.load.image('e_follow', 'images/e_follow.png');
	
	game.load.spritesheet('controller-indicator', 'images/controller-indicator.png', 16,16);
	this.load.image('bullet', 'images/bullet.png');
  }; 

  preloader.create = function () {
    game.state.start('menu');
  };

  return preloader;
};
