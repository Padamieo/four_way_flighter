var controls = {

	setup: function(game){

		game.input.gamepad.start();

		game.pad = [];

		for (i = 0; i < game.num_players; i++) {
			controls.pad_setup(game, i);
		}

	},

	pad_setup: function(game, num){

	//indicatorpos = (game.width)-(22);
	//indicator[num] = game.add.sprite(indicatorpos,(num*10), 'controller-indicator');
	//indicator[num].scale.x = indicator[num].scale.y = 1;
	//indicator[num].animations.frame = 1;

		// To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
		if(num == 0){
			game.pad[num] = game.input.gamepad.pad1;
		}
		if(num == 1){
			game.pad[num] = game.input.gamepad.pad2;
		}
		if(num == 2){
			game.pad[num] = game.input.gamepad.pad3;
		}
		if(num == 3){
			game.pad[num] = game.input.gamepad.pad4;
		}
	},

	controls_key: function(game, num){

		// cursors = game.input.keyboard.createCursorKeys();
		h_test = 0;
		v_test = 0;

		if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ){
			controls.fire(game, num);
			speed = 220;
		}else{
			speed = 300;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.A) ) {
			game.players.getAt(num).body.velocity.x = -speed;
			if( game.players.getAt(num).angle > -20 ){
				game.players.getAt(num).angle -= 1;
			}
		}else if( game.input.keyboard.isDown(Phaser.Keyboard.D) ){
			game.players.getAt(num).body.velocity.x = speed;
			if( game.players.getAt(num).angle < 20 ){
				game.players.getAt(num).angle += 1;
			}
		}else{
			h_test = 1;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.W) ) {
			game.players.getAt(num).body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			if(game.now_invincible[num] == 0){
				//game.players.getAt(num).animations.frame = 8+num;
			}
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) ){
			game.players.getAt(num).body.velocity.y = speed;
			//game.avatar.animations.play('back');
			if(game.now_invincible[num] == 0){
				//game.players.getAt(num).animations.frame = 12+num;
			}
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, num);

	},

	avatar_ani_reset: function(game, h, v, num){
		if( h+v == 3){
			if( game.players.getAt(num).angle != 0){
				y = game.players.getAt(num).y;

				if(game.players.getAt(num).angle < -0){
					game.players.getAt(num).angle += 1;
				}
				if(game.players.getAt(num).angle > 0){
					game.players.getAt(num).angle -= 1;
				}
			}

			if(game.now_invincible[num] == 0){
				if(game.players.getAt(num).animations.frame != 0+num){
					game.players.getAt(num).animations.frame = 0+num;
				}
			}

			game.players.getAt(num).body.velocity.y *= 0.96;
			game.players.getAt(num).body.velocity.x *= 0.96;

		}
	},

	controls_pad: function(game, play_num, pad_num){

		//cursors = game.input.keyboard.createCursorKeys();
		h_test = 0;
		v_test = 0;

		if ( game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
			if(game.players.getAt(play_num).alive == 1){
				controls.fire(play_num, pad_num);
				speed = 220;
			}
		}else{
			speed = 300;
		}

		if ( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
			game.avatar[play_num].body.velocity.x = -speed;
			if( game.avatar[play_num].angle > -20 ){
				game.avatar[play_num].angle -= 1;
			}
		}else if( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
			game.avatar[play_num].body.velocity.x = speed;
			if( game.avatar[play_num].angle < 20 ){
				game.avatar[play_num].angle += 1;
			}
		}else{
			h_test = 1;
		}

		if ( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
			game.avatar[play_num].body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			if(game.now_invincible[play_num] == 0){
				game.avatar[play_num].animations.frame = 8+play_num;
			}
		}else if( game.pad[pad_num].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
			game.avatar[play_num].body.velocity.y = speed;
			//game.avatar.animations.play('back');
			if(game.now_invincible[play_num] == 0){
				game.avatar[play_num].animations.frame = 12+play_num;
			}
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, play_num);

	},

	fire: function(game, play_num) {
		if (game.nextShotAt[play_num] > game.time.now) {
			return;
		}
		game.nextShotAt[play_num] = game.time.now + game.shotDelay[play_num];

		if (game.bulletPool.countDead() === 0) {
			return;
		}

		bullet = game.bulletPool.getFirstExists(false);
		bullet.reset(game.players.getAt(play_num).x, game.players.getAt(play_num).y, 'bullet');
		bullet.name = play_num;
		bullet.tint = 0xff00ff;

		if(play_num == 0){
			if ( cursors.left.isDown){
				bullet.body.velocity.x -= 500;
			}else if (cursors.right.isDown ){
				bullet.body.velocity.x += 500;
			}
			if (cursors.up.isDown){
				bullet.body.velocity.y -= 500;
			}else if (cursors.down.isDown){
				bullet.body.velocity.y += 500;
			}
		}else{
		//	controls.gamepad_fire(game, pad_num);
		}

	},

	gamepad_fire: function(game, pad_num){
		if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
			bullet.body.velocity.x -= 500;
		}else if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
			bullet.body.velocity.x += 500;
		}
		if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
			bullet.body.velocity.y -= 500;
		}else if (game.pad[pad_num].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
			bullet.body.velocity.y += 500;
		}
	}

};

module.exports = controls;

/*
	function pad_connect_indicator(num){
		if(game.input.gamepad.supported && game.input.gamepad.active && game.pad[num].connected) {
			indicator[num].animations.frame = 0;
		} else {
			indicator[num].animations.frame = 1;
		}
	}
*/
