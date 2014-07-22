module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    //game.load.image('logo', 'images/test.svg#grunt-cache-bust', '500', '240');
	game.load.image('sky', 'images/sky.png');
	
    game.load.image('star', 'images/star.png');
	
	game.load.image('health', 'images/health.png');
	game.load.image('live', 'images/live.png');
    game.load.spritesheet('dude', 'images/fighter.png', 32, 48);
	
	game.load.image('health_bar', 'images/healthbar.png');
	
	game.load.image('box', 'images/enemy.png');
	
	game.load.spritesheet('controller-indicator', 'images/controller-indicator.png', 16,16);
	this.load.image('bullet', 'images/bullet.png');
  };

  preloader.create = function () {
    game.state.start('game');
  };

  return preloader;
};
