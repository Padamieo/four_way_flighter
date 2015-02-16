var Phaser = require('Phaser'),
    properties = require('./properties'),
    states = {
      boot: require('./states/boot.js'),
      preloader: require('./states/preloader.js'),
      menu: require('./states/menu.js'),
      level: require('./states/level.js'),
      level_0: require('./states/level_0.js'),
      level_1A: require('./states/level_1A.js')
    },
    game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

game.state.add('boot', states.boot(game));
game.state.add('preloader', states.preloader(game));
game.state.add('menu', states.menu(game));
game.state.add('level', states.level(game));
game.state.add('level_0', states.level_0(game));
game.state.add('level_1A', states.level_1A(game));

game.state.start('boot');
