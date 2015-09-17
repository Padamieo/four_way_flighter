var Stats = require('Stats')
  , properties = require('../properties');

module.exports = function(game) {

  var boot = {};

  function addStats() {
    var stats = new Stats();

    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    setInterval(function () {
      stats.begin();
      stats.end();
    }, 1000 / 60);
  }

  boot.create = function () {

    if (properties.showStats) {
      addStats();
    }

    //
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    //this.scale.setScreenSize = true; // this broke phaser 2.4.3


    //game.scale.pageAlignHorizontally = false;
    //game.scale.pageAlignVertically = false;
    game.scale.refresh();

    game.level_range = {
      level_0: {
        0:{enemy: 3, min: 1, max: 4},
        1:{enemy: 2, min: 2, max: 10},
        2:{enemy: 5, min: 1, max: 4}
      },
      level_1A: {
        0:{enemy: 6, min: 0, max: 1},
        1:{enemy: 5, min: 1, max: 4}
      }
    };

    game.state.start('preloader');
  };

  return boot;
};
