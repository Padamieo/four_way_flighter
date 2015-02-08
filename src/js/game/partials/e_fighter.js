var e = require('e');

	var e_fighter = function(game) {

		Phaser.Sprite.call(this, game, x, y, 'e_swift');
		game.enemies.add(this);


		game.next_e_ShotAt[this.z] = 0;
		game.e_shotDelay[this.z] = 1400;

		game.stuck_on_path = 0;

		// Set the pivot point for this sprite to the center
		this.anchor.setTo(0.5, 0.5);

		this.health = 4;

		this.events.onRevived.add(function(){ alive(game, this)}, this);
		this.events.onKilled.add(function(){ e.explosion(game, this)}, this);

		// Enable physics on the missile
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.TARGET = e.random_alive_player(game);

		this.RANDOM_X = game.rnd.integerInRange(-100, game.width+100);
		this.RANDOM_Y = -30;//game.rnd.integerInRange(0, game.height);

		// Define constants that affect motion
		this.SPEED = 295; // missile speed pixels/second
		this.TURN_RATE = 2; // turn rate in degrees/frame
		this.MIN_DISTANCE = 150;
		this.MAX_DISTANCE = 300;
		this.kill_point = 4;

		this.tint = '0x999999';
	};

	var alive = function(game, nme){
		nme.health = 4;
		nme.tint = '0x999999';
	};

	e_fighter.prototype = Object.create(Phaser.Sprite.prototype);
	e_fighter.prototype.constructor = e_fighter;

	e_fighter.prototype.update = function() {
		// Calculate the angle from the e_fighter to the mouse cursor game.input.x
		// and game.input.y are the mouse position; substitute with whatever
		// target coordinates you need.
		if(this.alive){

			if( game.stuck_on_path == 0){
				pos = e.choose_player_target(this.game ,this, this.TARGET);
				var distance = this.game.math.distance(this.x, this.y, pos[0], pos[1]);
				var targetAngle = this.game.math.angleBetween(
					this.x, this.y,
					pos[0], pos[1]
				);
			}

			if( game.stuck_on_path == 1){
				var distance = this.game.math.distance(this.x, this.y, this.RANDOM_X, this.RANDOM_Y);
				var targetAngle = this.game.math.angleBetween(
					this.x, this.y,
					this.RANDOM_X, this.RANDOM_Y
				);
			}

			if (distance < this.MIN_DISTANCE) {
				game.stuck_on_path = 1;
			}else if(distance < this.MAX_DISTANCE){
				game.stuck_on_path = 0;
			}

			// Gradually (this.TURN_RATE) aim the e_fighter towards the target angle
			if (this.rotation !== targetAngle) {
				//console.log(this.z+"aiming at");
				// Calculate difference between the current angle and targetAngle
				var delta = targetAngle - this.rotation;

				// Keep it in range from -180 to 180 to make the most efficient turns.
				if (delta > Math.PI) delta -= Math.PI * 2;
				if (delta < -Math.PI) delta += Math.PI * 2;

				if (delta > 0) {
					// Turn clockwise
					this.angle += this.TURN_RATE;
				} else {
					// Turn counter-clockwise
					this.angle -= this.TURN_RATE;
				}

				// Just set angle to target angle if they are close
				if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
					this.rotation = targetAngle;
					e.fire(this.game, this, targetAngle);
				}
			}
			// Calculate velocity vector based on this.rotation and this.SPEED
			this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
			this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
		}
	};

module.exports = e_fighter;
