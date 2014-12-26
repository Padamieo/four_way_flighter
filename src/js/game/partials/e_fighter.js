// Missiles are a type of Phaser.Sprite
e_fighter.prototype = Object.create(Phaser.Sprite.prototype);
e_fighter.prototype.constructor = e_fighter;

e_fighter.prototype.update = function() {
	// Calculate the angle from the e_fighter to the mouse cursor game.input.x
	// and game.input.y are the mouse position; substitute with whatever
	// target coordinates you need.
	if(this.alive){

		if( game.stuck_on_path == 0){
			pos = choose_player_target(this, this.TARGET);
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
				e.fire(this, targetAngle);
			}
		}
		// Calculate velocity vector based on this.rotation and this.SPEED
		this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
		this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
	}
};

module.exports = e_fighter;
