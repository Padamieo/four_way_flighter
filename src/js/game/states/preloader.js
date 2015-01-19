module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png', '500', '240');

	game.load.spritesheet('switch', 'images/switch.jpeg', 32, 32);
	game.load.image('sky', 'images/sky.png');

    game.load.image('star', 'images/star.png');

	game.load.image('health', 'images/health.png');
	game.load.image('live', 'images/live.png');


  //game.load.spritesheet('dude', 'images/fighter.svg', 32, 48);
  game.load.image('fighter', 'images/fighter_v2.svg');

	game.load.spritesheet('controllers', 'images/controllers.png', 260, 107);

	game.load.spritesheet('explosion', 'images/explosion.svg', 256, 256);

	game.load.image('health_bar', 'images/healthbar.png');
	game.load.image('score_bar', 'images/scorebars.png');

	game.load.image('box', 'images/enemy.png');
	game.load.image('e_follow', 'images/e_follow.png');
	game.load.image('e_swift', 'images/e_swift.png');

	game.load.spritesheet('controller-indicator', 'images/controller-indicator.png', 16,16);

	//this.load.image('bullet', 'images/bullet.png');
	game.load.spritesheet('bullet', 'images/bullet.png', 8,8);

	//this.load.script('filter', 'js/lib/filters/Fire.js');
  };

  preloader.create = function () {
    game.state.start('menu');
  };

  return preloader;
};
