var e = require('e');
var g = require('general');

// e_light constructor
var e_light = function(game) {

	//x = game.rnd.integerInRange(0, game.width);
	//y = game.rnd.integerInRange(0, -(game.height));
	Phaser.Sprite.call(this, game, x, y, 'box');
	game.enemies.add(this);

	this.events.onRevived.add(function(){ alive(game, this)}, this);
	this.events.onKilled.add(function(){ death(game, this)}, this);

	game.next_e_ShotAt[this.z] = 0;
	game.e_shotDelay[this.z] = 1400;

	this.anchor.setTo(0.5, 0.5);

	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.health = 5;
	this.MAX_SPEED = 250;
	this.MIN_DISTANCE = 90;
	this.kill_point = 5;

	this.tint = '0x999999';

	this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
	this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
	this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
	var lightBitmap = this.game.add.image(0, 0, this.bitmap);

	lightBitmap.blendMode = Phaser.blendModes.ADD;
	this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
	this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
	this.rayBitmapImage.visible = true;

};

var alive = function(game, nme){
	nme.health = 5;
	nme.tint = '0x999999';
}

var death = function(game, nme){
	e.explosion(game, this);
}

// e_followers are a type of Phaser.Sprite
e_light.prototype = Object.create(Phaser.Sprite.prototype);
e_light.prototype.constructor = e_light;

e_light.prototype.update = function(game) {

	if(this.alive){
			// Next, fill the entire light bitmap with a dark shadow color.
			this.bitmap.context.fillStyle = 'rgb(0, 0, 0)';
			this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

			// An array of the stage corners that we'll use later
			var stageCorners = [
					new Phaser.Point(0, 0),
					new Phaser.Point(this.game.width, 0),
					new Phaser.Point(this.game.width, this.game.height),
					new Phaser.Point(0, this.game.height)
			];

			// Ray casting!
			// Cast rays through the corners of each wall towards the stage edge.
			// Save all of the intersection points or ray end points if there was no intersection.
			var points = [];
			var ray = null;
			var intersect;
			var i;
			this.game.players.forEach(function(wall) {
					// Create a ray from the light through each corner out to the edge of the stage.
					// This array defines points just inside of each corner to make sure we hit each one.
					// It also defines points just outside of each corner so we can see to the stage edges.
					var corners = [
							new Phaser.Point(wall.x+0.1, wall.y+0.1),
							new Phaser.Point(wall.x-0.1, wall.y-0.1),

							new Phaser.Point(wall.x-0.1 + wall.width, wall.y+0.1),
							new Phaser.Point(wall.x+0.1 + wall.width, wall.y-0.1),

							new Phaser.Point(wall.x-0.1 + wall.width, wall.y-0.1 + wall.height),
							new Phaser.Point(wall.x+0.1 + wall.width, wall.y+0.1 + wall.height),

							new Phaser.Point(wall.x+0.1, wall.y-0.1 + wall.height),
							new Phaser.Point(wall.x-0.1, wall.y+0.1 + wall.height)
					];

					// Calculate rays through each point to the edge of the stage
					for(i = 0; i < corners.length; i++) {
							var c = corners[i];

							// Here comes the linear algebra.
							// The equation for a line is y = slope * x + b
							// b is where the line crosses the left edge of the stage
							var slope = (c.y - this.y) / (c.x - this.x);
							var b = this.y - slope * this.x;

							var end = null;

							if (c.x === this.x) {
									// Vertical lines are a special case
									if (c.y <= this.y) {
											end = new Phaser.Point(this.x, 0);
									} else {
											end = new Phaser.Point(this.x, this.game.height);
									}
							} else if (c.y === this.y) {
									// Horizontal lines are a special case
									if (c.x <= this.x) {
											end = new Phaser.Point(0, this.y);
									} else {
											end = new Phaser.Point(this.game.width, this.y);
									}
							} else {
									// Find the point where the line crosses the stage edge
									var left = new Phaser.Point(0, b);
									var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
									var top = new Phaser.Point(-b/slope, 0);
									var bottom = new Phaser.Point((this.game.height-b)/slope, this.game.height);

									// Get the actual intersection point
									if (c.y <= this.y && c.x >= this.x) {
											if (top.x >= 0 && top.x <= this.game.width) {
													end = top;
											} else {
													end = right;
											}
									} else if (c.y <= this.y && c.x <= this.x) {
											if (top.x >= 0 && top.x <= this.game.width) {
													end = top;
											} else {
													end = left;
											}
									} else if (c.y >= this.y && c.x >= this.x) {
											if (bottom.x >= 0 && bottom.x <= this.game.width) {
													end = bottom;
											} else {
													end = right;
											}
									} else if (c.y >= this.y && c.x <= this.x) {
											if (bottom.x >= 0 && bottom.x <= this.game.width) {
													end = bottom;
											} else {
													end = left;
											}
									}
							}

							// Create a ray
							ray = new Phaser.Line(this.x, this.y, end.x, end.y);

							// Check if the ray intersected the wall
							intersect = this.getWallIntersection(ray);
							if (intersect) {
									// This is the front edge of the light blocking object
									points.push(intersect);
							} else {
									// Nothing blocked the ray
									points.push(ray.end);
							}
					}
			}, this);

			// Shoot rays at each of the stage corners to see if the corner
			// of the stage is in shadow. This needs to be done so that
			// shadows don't cut the corner.
			for(i = 0; i < stageCorners.length; i++) {
					ray = new Phaser.Line(this.x, this.y,
							stageCorners[i].x, stageCorners[i].y);
					intersect = this.getWallIntersection(ray);
					if (!intersect) {
							// Corner is in light
							points.push(stageCorners[i]);
					}
			}

			// Now sort the points clockwise around the light
			// Sorting is required so that the points are connected in the right order.
			//
			// This sorting algorithm was copied from Stack Overflow:
			// http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
			//
			// Here's a pseudo-code implementation if you want to code it yourself:
			// http://en.wikipedia.org/wiki/Graham_scan
			var center = { x: this.x, y: this.y };
			points = points.sort(function(a, b) {
					if (a.x - center.x >= 0 && b.x - center.x < 0)
							return 1;
					if (a.x - center.x < 0 && b.x - center.x >= 0)
							return -1;
					if (a.x - center.x === 0 && b.x - center.x === 0) {
							if (a.y - center.y >= 0 || b.y - center.y >= 0)
									return 1;
							return -1;
					}

					// Compute the cross product of vectors (center -> a) x (center -> b)
					var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
					if (det < 0)
							return 1;
					if (det > 0)
							return -1;

					// Points a and b are on the same line from the center
					// Check which point is closer to the center
					var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
					var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
					return 1;
			});

			// Connect the dots and fill in the shape, which are cones of light,
			// with a bright white color. When multiplied with the background,
			// the white color will allow the full color of the background to
			// shine through.

			this.bitmap.context.beginPath();

				// var myBitmap = this.game.add.bitmapData(300, 300);
				// var grd = myBitmap.context.createRadialGradient(this.x ,this.y, 600, this.x ,this.y, 1500);
				// grd.addColorStop(0,"rgb(150,150,150);");
				// grd.addColorStop(1,"rgba(100,100,100, 0);");
				// this.bitmap.context.fillStyle = grd;
			this.bitmap.context.fillStyle = 'rgb(150, 150, 150)';

			this.bitmap.context.moveTo(points[0].x, points[0].y);
			for(var j = 0; j < points.length; j++) {
				this.bitmap.context.lineTo(points[j].x, points[j].y);
			}
			this.bitmap.context.closePath();
			this.bitmap.context.fill();

			// Draw each of the rays on the rayBitmap
			this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);

			this.rayBitmap.context.beginPath();
			this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
			this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
			this.rayBitmap.context.moveTo(points[0].x, points[0].y);
			for(var k = 0; k < points.length; k++) {
				this.rayBitmap.context.moveTo(this.x, this.y);
				this.rayBitmap.context.lineTo(points[k].x, points[k].y);
				this.rayBitmap.context.fillRect(points[k].x-2, points[k].y-2, 4, 4);
			}
			this.rayBitmap.context.stroke();

			// This just tells the engine it should update the texture cache
			this.bitmap.dirty = true;
			this.rayBitmap.dirty = true;

/////////////////////////////////////

			// v = this.game.math.degToRad(90);
			// e.fire(this.game, this, v);

		if(this.body.y < this.game.height+50){
			this.body.velocity.x = 0;
			this.body.velocity.y = 50;
			this.body.rotate += 1;
		}else{
			this.x = this.game.rnd.integerInRange(0, this.game.width);
			this.y = -50;
		}
	}else{
		//cant seem to kill it.
		this.rayBitmapImage.visible = false;
		this.bitmap.visible = false;
		this.rayBitmap.visible = false;

	}
/////////////////////////////////////
};

// Given a ray, this function iterates through all of the walls and
// returns the closest wall intersection from the start of the ray
// or null if the ray does not intersect any walls.
e_light.prototype.getWallIntersection = function(ray) {
		var distanceToWall = Number.POSITIVE_INFINITY;
		var closestIntersection = null;

		// For each of the walls...
		this.game.players.forEach(function(wall) {
				// Create an array of lines that represent the four edges of each wall
				var lines = [
						new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
						new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
						new Phaser.Line(wall.x + wall.width, wall.y,
								wall.x + wall.width, wall.y + wall.height),
						new Phaser.Line(wall.x, wall.y + wall.height,
								wall.x + wall.width, wall.y + wall.height)
				];

				// Test each of the edges in this wall against the ray.
				// If the ray intersects any of the edges then the wall must be in the way.
				for(var i = 0; i < lines.length; i++) {
						var intersect = Phaser.Line.intersects(ray, lines[i]);
						if (intersect) {
								// Find the closest intersection
								distance =
										this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
								if (distance < distanceToWall) {
										distanceToWall = distance;
										closestIntersection = intersect;
								}
						}
				}
		}, this);

		return closestIntersection;
};

module.exports = e_light;
