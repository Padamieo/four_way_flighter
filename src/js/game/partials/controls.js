var controls = {

	setup: function(game){
		game.input.gamepad.start();
		cursors = game.input.keyboard.createCursorKeys();
		game.pad = [];
		if(game.num_players == null){
			for (i = 0; i < 4; i++) {
				controls.pad_setup(game, i);
			}
		}else{
			for (i = 0; i < game.num_players; i++) {
				controls.pad_setup(game, i);
			}
		}

		game.formerMouse=-1;
	},

	pad_setup: function(game, num){
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

	controlers_indicators: function(game, x, y){
		//indicatorpos = (game.width)-(22);
		//indicator[num] = game.add.sprite(indicatorpos,(num*10), 'controller-indicator');
		//indicator[num].scale.x = indicator[num].scale.y = 1;
		//indicator[num].animations.frame = 1;
	},

	controls_key: function(game, player_id, object){
		h_test = 0;
		v_test = 0;

		if ( cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || game.input.activePointer.isDown){
			controls.fire(game, player_id, object);
			speed = game.players.getAt(player_id).LOW_SPEED;
		}else{
			speed = game.players.getAt(player_id).TOP_SPEED;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.A) ) {
			controls.move_left(game, player_id, object);
		}else if( game.input.keyboard.isDown(Phaser.Keyboard.D) ){
			controls.move_right(game, player_id, object);
		}else{
			h_test = 1;
		}

		if ( game.input.keyboard.isDown(Phaser.Keyboard.W) ) {
			controls.move_up(game, player_id, object);
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.S) ){
			controls.move_down(game, player_id, object);
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, player_id, object);

		if(!isNaN( object.getAt(player_id).name)){
			if( game.input.keyboard.isDown(Phaser.Keyboard.F) ){
					if(game.players.getAt(player_id).energy >= game.MAX_ENERGY){
						game.players.getAt(player_id).zoid_request = 1;
					}
			}else{
				if(game.players.getAt(player_id).zoid_request == 1){
					game.players.getAt(player_id).zoid_request = 0;
				}
			}

			if( game.input.keyboard.isDown(Phaser.Keyboard.Q) ){
				game.players.getAt(player_id).show_energy = 1;
			}

			if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
				game.players.getAt(player_id).show_health = 1;
			}
		}
	},

	avatar_ani_reset: function(game, h, v, player_id, object){
		if( h+v == 3){
			if( object.getAt(player_id).angle != 0){
				y = object.getAt(player_id).y;

				if(object.getAt(player_id).angle < -0){
					object.getAt(player_id).angle += 1;
				}
				if(object.getAt(player_id).angle > 0){
					object.getAt(player_id).angle -= 1;
				}
			}
			object.getAt(player_id).body.velocity.y *= 0.96;
			object.getAt(player_id).body.velocity.x *= 0.96;
		}
	},

	controls_pad: function(game, player_id, object, pad_id){
		h_test = 0;
		v_test = 0;

		if ( game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.01 || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.01 || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01 ||  game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.01){
			if(game.players.getAt(player_id).alive == 1){
				controls.fire(game, player_id, object, pad_id);
				speed = game.players.getAt(player_id).LOW_SPEED;
			}
		}else{
			speed = game.players.getAt(player_id).TOP_SPEED;
		}

		speed = game.players.getAt(player_id).TOP_SPEED;

		if ( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
			controls.move_left(game, player_id); //confirm this works
		}else if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01){
			controls.move_right(game, player_id);//confirm this works
		}else{
			h_test = 1;
		}

		if ( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
			controls.move_up(game, player_id);
		}else if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01){
			controls.move_down(game, player_id);
		}else{
			v_test = 2;
		}

		controls.avatar_ani_reset(game, h_test, v_test, player_id);

		if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_Y) ){
			if(game.players.getAt(player_id).energy >= game.MAX_ENERGY){
				game.players.getAt(player_id).zoid_request = 1;
			}
		}else{
			if(game.players.getAt(player_id).zoid_request == 1){
				game.players.getAt(player_id).zoid_request = 0;
			}
		}

		if( game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_A) ){
			game.players.getAt(player_id).show_energy = 1;
		}

		if(game.pad[pad_id].isDown(Phaser.Gamepad.XBOX360_B)){
			game.players.getAt(player_id).show_health = 1;
		}

	},

	move_left: function(game, player_id, object){
		object.getAt(player_id).body.velocity.x = -speed;
		if( object.getAt(player_id).angle > -20 ){
		  object.getAt(player_id).angle -= 1;
		}
	},

	move_right: function(game, player_id, object){
		object.getAt(player_id).body.velocity.x = speed;
		if( object.getAt(player_id).angle < 20 ){
			object.getAt(player_id).angle += 1;
		}
	},

	move_up: function(game, player_id, object){
		object.getAt(player_id).body.velocity.y = -speed;
		//game.avatar.animations.play('forward');
	},

	move_down: function(game, player_id, object){
		console.log(speed); //not sure if it accepts speed
		object.getAt(player_id).body.velocity.y = speed;
		//game.avatar.animations.play('back');
	},

	fire: function(game, player_id, object, pad_id) {
		if (game.nextShotAt[player_id] > game.time.now) {
			return;
		}
		game.nextShotAt[player_id] = game.time.now + game.shotDelay[player_id];

		if (game.bulletPool.countDead() === 0) {
			return;
		}

		player = object.getAt(player_id);
		console.log(player_id);//megazzord NAME?!?

		bullet = game.bulletPool.getFirstExists(false);
		bullet.reset(player.x, player.y, 'bullet');
		bullet.name = player_id;
		bullet.tint = player.tint;
		bullet.damage = player.fire_power;
		bullet.scale.y = player.fire_power;
		bullet.scale.x = player.fire_power;
		//console.log(player.fire_power);

		if(game.controls[player_id] == 'K'){
			controls.keyboard_fire(game, bullet);
		}else{
			controls.gamepad_fire(game, pad_id);
		}

	},

	gamepad_fire: function(game, pad_id){
		x = game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X)/2*Math.PI;
		y = game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y)/2*Math.PI;
		if(game.pad[pad_id].axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.01){
			angle = (Math.atan(y/x)+Math.PI);
		}else{
			angle = Math.atan(y/x);
		}
		bullet.rotation = angle;
		bullet.body.velocity.x = Math.cos(bullet.rotation) * 1000;
		bullet.body.velocity.y = Math.sin(bullet.rotation) * 1000;

		/*
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
		*/
	},

	keyboard_fire: function(game, bullet){
		if (game.input.activePointer.isDown){
			x = game.input.mousePointer.x;
			y = game.input.mousePointer.y;
			var angle = game.math.angleBetween( bullet.x, bullet.y, x, y );
			bullet.rotation = angle;
			bullet.body.velocity.x = Math.cos(bullet.rotation) * 1000;
			bullet.body.velocity.y = Math.sin(bullet.rotation) * 1000;
		}else{
			if ( cursors.left.isDown){
				bullet.body.velocity.x -= 750;
			}else if (cursors.right.isDown ){
				bullet.body.velocity.x += 750;
			}
			if (cursors.up.isDown){
				bullet.body.velocity.y -= 750;
			}else if (cursors.down.isDown){
				bullet.body.velocity.y += 750;
			}
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
