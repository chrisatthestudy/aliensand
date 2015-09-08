/*
 *  ============================================================================
 *  Vector3d
 *  ============================================================================
 *  Simple vector class. It can also be used for 2d, by leaving the z parameter
 *  at 0.
 *  ----------------------------------------------------------------------------
 */
var Vector3d = function( x, y, z ) {
    'use strict';

    var self = {
	// setup() - simple initialisation, called automatically when the
	// function is invoked
	setup: function( x, y, z ) {
	    self.x = x || 0;
	    self.y = y || 0;
	    self.z = z || 0;
	},

	// copy() - returns a copy of this vector
	copy: function( ) {
	    var result = Vector3d();
	    result.x = self.x;
	    result.y = self.y;
	    result.z = self.z;
	    return result;
	},

	// add() - adds the supplied vector, which should support at least the
	// x and y fields, and optionally a z field (this will default to 0 if
	// it does not exist). Normally this will be another Vector3d.
	// It returns the new vector
	add: function( vector ) {
	    var result = self.copy();
	    result.x += vector.x;
	    result.y += vector.y;
	    result.z += vector.z || 0;
	    return result;
	},

	// subtract() - subtracts the supplied vector, using the same rules
	// and limitations of the add() function. It returns the new vector.
	subtract: function( vector ) {
	    var result = self.copy();
	    result.x -= vector.x;
	    result.y -= vector.y;
	    result.z -= vector.z || 0;
	    return result;
	},

	// multiply() - scalar multiplication by the supplied multiplicand.
	multiply: function( multiplicand ) {
	    var result = self.copy();
	    result.x *= multiplicand;
	    result.y *= multiplicand;
	    result.z *= multiplicand;
	    return result;
	},

	// divide() - scalar division by the supplied dividend. Ignores any
	// attempt to divide by zero. It returns the new vector;
	divide: function( dividend ) {
	    var result = self.copy();
	    if (dividend !== 0) {
		result.x /= dividend;
		result.y /= dividend;
		result.z /= dividend;
	    }
	    return result;
	},

	// displacement() - returns the distance from this vector to the
	// supplied vector. This will always be a positive value.
	displacement: function( fromVector ) {
	    var vector = Vector3d;
	    vector = self.copy();
	    vector = fromVector.subtract(vector);
	    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
	},

	// magnitude() - returns the length of the vector
	magnitude: function( ) {
	    return Math.sqrt(Math.pow(self.x, 2) + Math.pow(self.y, 2) + Math.pow(self.z, 2));
	}
    };

    self.setup( x, y, z );
    return self;
};

/*
 *  ============================================================================
 *  Boid()
 *  ============================================================================
 *  Handles a single Boid
 *  ----------------------------------------------------------------------------
 */
var Boid = function( options ) {
    'use strict';

    // The actual object representing this function is assigned to 'self', 
    // which is returned from this function so that the returned value 
    // effectively an alias for Boid.self.
    var self = {

	// setup() performs all the necessary initialisation
	setup: function( options ) {
	    debug("setup()");

	    self.options = options;
	    self.flock = options.flock;

	    // Add the sprite set-up details to the options
	    self.options.w = 3;
	    self.options.h = 3;

	    self.sprite = PixelMap( self.options );

	    self.position = Vector3d( self.options.x, self.options.y );
	    self.velocity = Vector3d( Math.random() * 3, Math.random() * 3 );

	    // Set the wing-position (this actually maps to the position of
	    // the pixels that represent the wings: 1 = up, 2 = middle,
	    // 3 = down). Select a random position.
	    self.wingpos = Math.floor((Math.random() * 3)) + 1;
	    if (self.wingpos == 3) {
		self.wingdir = -1;
	    }
	    else if (self.wingpos == 1) {
		self.wingdir = 1;
	    }
	    else {
		self.wingdir = 1;
	    }

	},

	// update() is called on each tick
	update: function( ) {
	    debug("update()");
	    var color = {r: 0, g:250, b:0, a: 0};

	    // Move the wing
	    self.wingpos = self.wingpos + self.wingdir;
	    if ((self.wingpos == 3) || (self.wingpos == 1)) {
		self.wingdir = self.wingdir * -1;
	    }

	    // Clear to transparent
	    self.sprite.clear( color );

	    // Set to opaque, and draw the boid
	    color.a = 255;
	    self.sprite.set(0, self.wingpos - 1, color);
	    self.sprite.set(1, 1, color);
	    self.sprite.set(2, self.wingpos - 1, color);

	    // Apply the flocking rules
	    var v1 = self.moveTowardsCentre();
	    var v2 = self.maintainDistance();
	    var v3 = self.matchVelocity();
	    var v4 = self.keepInBounds();

	    self.velocity = self.velocity.add(v1);
	    self.velocity = self.velocity.add(v2);
	    self.velocity = self.velocity.add(v3);
	    self.velocity = self.velocity.add(v4);

	    debug("Changing position", 2);
	    self.limitVelocity();
	    self.position = self.position.add(self.velocity);
	},

	// moveTowardsCentre() moves the boid towards the centre of the
	// flock
	moveTowardsCentre: function( ) {
	    debug("moveTowardsCentre", 2);
	    var centre = Vector3d();
	    var count = self.flock.count();
	    var boid = null;
	    for (var i = 0; i < count; i++) {
		boid = self.flock.boids[i]; 
		if (boid != self) {
		    centre = centre.add(boid.position);                    
		}
	    }
	    // Final calculation of the centre
	    centre = centre.divide( count );

	    // How far to move the boid towards the centre
	    centre = centre.subtract(self.position);
	    centre = centre.divide( 100 );

	    // Return the vector representing how far the boid should move
	    return centre.copy();
	},

	// maintainDistance() keeps the boid a certain distance away from any
	// other boids
	maintainDistance: function( ) {
	    debug("maintainDistance", 2);
	    var distance = Vector3d();
	    var displacement;
	    var offset;
	    var boid;
	    var count = self.flock.count();
	    for (var i = 0; i < count; i++) {
		boid = self.flock.boids[i]; 
		if (boid != self) {
		    displacement = self.position.displacement(boid.position);
		    if (displacement < 5) {
			offset = self.position.subtract(boid.position);
			distance = distance.subtract(offset);
		    }                        
		}
	    }
	    return distance.copy();
	},

	// matchVelocity() keeps the boid's velocity matched with the velocity
	// of nearby boids
	matchVelocity: function( ) {
	    debug("matchVelocity", 2);
	    var boid;
	    var result = Vector3d();
	    var count = self.flock.count();
	    for (var i = 0; i < count; i++) {
		boid = self.flock.boids[i]; 
		if (boid != self) {
		    result = result.add(boid.velocity);
		}
	    }
	    result = result.divide( count );
	    result = result.subtract(self.velocity);
	    result = result.divide( 8 );
	    return result.copy();
	},

	// keepInBounds() keeps the boid within the canvas area
	keepInBounds: function( ) {
	    var result = Vector3d();
	    if (self.position.x < 50) {
		result.x = 10;
	    } else if (self.position.x > (self.options.context.canvas.width - 50)) {
		result.x = -10;
	    }
	    if (self.position.y < 50) {
		result.y = 10;
	    } else if (self.position.y > (self.options.context.canvas.height - 50)) {
		result.y = -10;
	    }
	    return result;
	},

	// limitVelocity() prevents the boid from moving too quickly, which
	// can happen as a result of the accumulation of the other rules. If
	// you remove the call to this function, the boids will get faster
	// and faster over time.
	limitVelocity: function( ) {
	    var limit = 20;
	    var speed = self.velocity.magnitude( );
	    if (speed > limit) {
		self.velocity = self.velocity.divide(limit);
	    }
	},

	draw: function( ) {
	    debug("draw()");
	    self.sprite.x = self.position.x;
	    self.sprite.y = self.position.y;
	    self.sprite.draw( );
	}
    };

    // Call our setup() function, passing on any options that were passed to
    // the function
    self.setup( options );
    return self;
};

/*
 *  ============================================================================
 *  Flock()
 *  ============================================================================
 *  Models a flock of boids
 *  ----------------------------------------------------------------------------
 */
var Flock = function( options ) {
    'use strict';

    // The actual object representing this function is assigned to 'self', 
    // which is returned from this function so that the returned value 
    // effectively an alias for Flock.self.
    var self = {

	// setup() performs all the necessary initialisation
	setup: function( options ) {
	    debug("setup()");
	    var i = 0;

	    // Set up the default values for the boids
	    var boid_options = { flock: self, context: options.context };

	    // Create the boids
	    self.boids = [];
	    var count = 50;
	    for (i = 0; i < count; i++) {
		// Select a random starting position
		boid_options.x = Math.random() * 100;
		boid_options.y = Math.random() * 100;
		self.boids.push(Boid(boid_options));
	    }
	},

	// update() is called on each tick
	update: function( ) {
	    debug("update()");
	    // Update each boid
	    for (var i = 0; i < self.boids.length; i++) {
		self.boids[i].update();
	    }
	},

	draw: function( ) {
	    debug("draw()");
	    // Draw all the boids
	    for (var i = 0; i < self.boids.length; i++) {
		self.boids[i].draw();
	    }
	},

	count: function( ) {
	    return self.boids.length;
	}
    };

    // Call our setup() function, passing on any options that were passed to
    // the function
    self.setup( options );
    return self;
};
