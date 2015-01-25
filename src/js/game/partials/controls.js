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

	controls_key: function(game, player_id){

		// cursors = game.input.keyboard.createCursorKeys();
		h_test = 0;
		v_test = 0;

		if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ){
			controls.fire(game, player_id);
			speed = game.players.getAt(player_id).LOW_SPEED;
		}else{
			speed = game.players.getAt(player_id).TOP_SPEED;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.A) ) {
			game.players.getAt(player_id).body.velocity.x = -speed;
			if( game.players.getAt(player_id).angle > -20 ){
				game.players.getAt(player_id).angle -= 1;
			}
		}else if( game.input.keyboard.isDown(Phaser.Keyboard.D) ){
			game.players.getAt(player_id).body.velocity.x = speed;
			if( game.players.getAt(player_id).angle < 20 ){
				game.players.getAt(player_id).angle += 1;
			}
		}else{
			h_test = 1;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.W) ) {
			game.players.getAt(player_id).body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			// if(game.now_invincible[player_id] == 0){
			// 	//game.players.getAt(player_id).animations.frame = 8+player_id;
			// }
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) ){
			game.players.getAt(player_id).body.velocity.y = speed;
			//game.avatar.animations.play('back');
			// if(game.now_invincible[player_id] == 0){
			// 	//game.players.getAt(player_id).animations.frame = 12+player_id;
			// }
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, player_id);

		if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
			game.players.getAt(player_id).show_health = 1;
		}

	},

	avatar_ani_reset: function(game, h, v, player_id){
		if( h+v == 3){
			if( game.players.getAt(player_id).angle != 0){
				y = game.players.getAt(player_id).y;

				if(game.players.getAt(player_id).angle < -0){
					game.players.getAt(player_id).angle += 1;
				}
				if(game.players.getAt(player_id).angle > 0){
					game.players.getAt(player_id).angle -= 1;
				}
			}

			game.players.getAt(player_id).body.velocity.y *= 0.96;
			game.players.getAt(player_id).body.velocity.x *= 0.96;

		}
	},

	controls_pad: function(game, player_id, pad_id){

		//cursors = game.input.keyboard.createCursorKeys();
		h_test = 0;
		v_test = 0;

		if ( game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
			if(game.players.getAt(player_id).alive == 1){
				controls.fire(game, player_id, pad_id);
				speed = game.players.getAt(player_id).LOW_SPEED;
			}
		}else{
			speed = game.players.getAt(player_id).TOP_SPEED;
		}

		if ( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
			game.players.getAt(player_id).body.velocity.x = -speed;
			if( game.players.getAt(player_id).angle > -20 ){
				game.players.getAt(player_id).angle -= 1;
			}
		}else if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
			game.players.getAt(player_id).body.velocity.x = speed;
			if( game.players.getAt(player_id).angle < 20 ){
				game.players.getAt(player_id).angle += 1;
			}
		}else{
			h_test = 1;
		}

		if ( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
			game.players.getAt(player_id).body.velocity.y = -speed;
			//game.avatar.animations.play('forward');
			//if(game.now_invincible[player_id] == 0){
				//game.players.getAt(player_id).animations.frame = 8+play_num;
			//}
		}else if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
			game.players.getAt(player_id).body.velocity.y = speed;
			//game.avatar.animations.play('back');
			// if(game.now_invincible[player_id] == 0){
			// 	game.players.getAt(player_id).animations.frame = 12+player_id;
			// }
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, player_id);

		if(game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_A)){
			game.players.getAt(player_id).show_health = 1;
		}

	},

	fire: function(game, player_id, pad_id) {
		if (game.nextShotAt[player_id] > game.time.now) {
			return;
		}
		game.nextShotAt[player_id] = game.time.now + game.shotDelay[player_id];

		if (game.bulletPool.countDead() === 0) {
			return;
		}

		bullet = game.bulletPool.getFirstExists(false);
		bullet.reset(game.players.getAt(player_id).x, game.players.getAt(player_id).y, 'bullet');
		bullet.name = player_id;
		bullet.tint = speed = game.players.getAt(player_id).tint;

		if(game.controls[player_id] == 'K'){
			controls.keyboard_fire(game, bullet);
		}else{
			controls.gamepad_fire(game, pad_id);
		}

	},

	gamepad_fire: function(game, pad_id){
		if (game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ){
			bullet.body.velocity.x -= 500;
		}else if (game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01 ){
			bullet.body.velocity.x += 500;
		}
		if (game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01){
			bullet.body.velocity.y -= 500;
		}else if (game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01){
			bullet.body.velocity.y += 500;
		}
	},

	keyboard_fire: function(game, bullet){
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
