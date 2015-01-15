var Phaser = require('Phaser')
  , properties = require('./properties')
  , states =
    { boot: require('./states/boot.js')
    , preloader: require('./states/preloader.js')
	, menu: require('./states/menu.js')
    , level: require('./states/level.js')
    }
  , game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

game.state.add('boot', states.boot(game));
game.state.add('preloader', states.preloader(game));
game.state.add('menu', states.menu(game));
game.state.add('level', states.level(game));

game.state.start('boot');
