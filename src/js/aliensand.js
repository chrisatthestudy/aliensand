/*jslint browser: true*/
/*jslint plusplus: true */
/*global window, console */

var AlienSand = (function() {
    
    /*
     *  ============================================================================
     *  requestAnim
     *  ============================================================================
     *  Shim layer by Paul Irish.
     *  ----------------------------------------------------------------------------
     */
    window.requestAnimFrame = (function(){
      'use strict';
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                  window.setTimeout(callback, 16.666);
              };
    }());

    /*
     *  ============================================================================
     *  Sun()
     *  ============================================================================
     *  Simple representation of the sun.
     *  ----------------------------------------------------------------------------
     */
    var Sun = function( options ) {

	var self = {

	    setup: function( options ) {
		self.context = options.context;
		self.angle_units = (2 * Math.PI) / 6400.0;
		self.angle = (self.angle_units * 6400.0);
		self.halo_step = 1;
	    },

	    update: function( ) {
	    },

	    draw: function( ) {
		// x(t) = r cos(t) + j       y(t) = r sin(t) + k
		var x = (400 * Math.cos(self.angle)) + 150;
		var y = (800 * Math.sin(self.angle)) + 250;
                self.context.fillStyle = "#004400";
		self.context.beginPath();
		self.context.arc(x, y, 20, 0, Math.PI * 2, false);
		self.context.fill();
		
		self.context.beginPath();
		self.context.lineWidth = 10;
                self.context.strokeStyle = 'rgba(0,64,0,' + (1.0 - self.halo_step / 10) + ')';
		console.log(self.context.strokeStyle);
		self.context.arc(x, y, 20 + self.halo_step, 0, Math.PI * 2, false);
		self.context.stroke();
		
		self.halo_step = self.halo_step + 0.1;
		if (self.halo_step > 10) {
		    self.halo_step = 1;
		}
		self.angle = self.angle - self.angle_units;
		if (self.angle < 0) {
		    self.angle = (self.angle_units * 6400.0);
		}
		self.context.lineWidth = 1;
	    }
	};
	self.setup( options );
	return self;
    };
    
    /*
     *  ============================================================================
     *  App()
     *  ============================================================================
     *  The main application class. Call 'execute' on this to start it running.
     *  ----------------------------------------------------------------------------
     */
    var App = function( options ) {
        'use strict';
        
        // The actual object representing this function is assigned to 'self', 
        // which is return from this function so that App is effectively an alias
        // for App.self.
        var self = {
            
            // setup() performs all the necessary initialisation
            setup: function( options ) {
                // Get the canvas and context and store these away
                self.canvas = document.getElementById('canvas');
                self.context = canvas.getContext('2d');
    
                self.startTime = (new Date()).getTime();
                self.prevTime  = self.startTime;
                self.fps       = 0;
                self.ticks     = 0;
                self.tardis_frame = 0;
                self.tardis_fade = 0;

                var scale = 3.0;
                self.tardis = Tardis(self.context, self.canvas.width - 150, self.canvas.height - (40 + (scale * 51)), scale)
		self.sun = Sun( { context: self.context } );
                
                self.running = true;
                
                self.flock = Flock( { context: self.context } );
                
            },
            
            // update() is called on each frame tick
            update: function( ) {
                var currentTime;
                var delta = (currentTime=new Date()) - self.prevTime;
                self.fps += (delta - self.fps) / 30;
                self.prevTime = currentTime;
                self.ticks += delta;
                
                if (self.ticks > 120) {
                    self.tardis_frame += 1;
                    if (self.tardis_frame > 250) {
                        self.tardis_fade -= 0.05;
                        if (self.tardis_fade < 0.0) {
                            self.tardis_fade = 0;
                            self.tardis_frame = 0;
                        }
                    } else if (self.tardis_frame > 100) {
                        self.tardis_fade += 0.05;
                        if (self.tardis_fade > 255.0) {
                            self.tardis_fade = 255.0;
                        }
                    }
                    self.flock.update( );
		    self.sun.update( );
                    self.ticks = 0;
                }
            },
            
            draw: function( ) {
                // Temporary hack for mobile displays
                if (window.innerWidth < 481) {
                    self.canvas.width  = window.innerWidth;
                }
                // Draw the 'ground'
                self.context.fillStyle = "#222922";
                self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);

		self.sun.draw( );
		
                self.context.fillStyle = "#004400";
                self.context.fillRect(0, self.canvas.height - 50, self.canvas.width, 50);
                // Draw the boids
                self.flock.draw( );
                // Draw the TARDIS
                var scale = 3.0;
                self.tardis.start_x = self.canvas.width - 150;
                self.tardis.start_y = self.canvas.height - (40 + (scale * 51))
                self.tardis.draw( self.tardis_fade );
            },
            
            // execute() runs the main loop
            execute: function( ) {
                debug("Updating");
                // Update all the components
                self.update( );
                
                // Clear the screen
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    
                debug("Drawing");
                // Draw all the components
                self.draw( );
                
                // Recursively call this function for as long as we are running
                if (self.running) {
                    requestAnimFrame( self.execute );
                }
            },
            
        };
    
        // Call our setup() function, passing on any options that were passed to
        // the App function
        self.setup( options );
        return self;
    };

    function hideNoJS()
    {
        var elementArray = document.getElementsByClassName("no-js");
    
        for(var i = (elementArray.length - 1); i >= 0; i--)
        {
            elementArray[i].className = "hide-me";
        }
    }
    
    /*
     *  ============================================================================
     *  document.onreadystatechange
     *  ============================================================================
     *  The document.onreadystatechange event is called by the browser while it
     *  is loading the current document. Once the document.readyState is 'complete',
     *  the document has finished loading, and we can create and start the app.
     *  ----------------------------------------------------------------------------
     */
    document.onreadystatechange = function () {
        // console.log(document.readyState);
        if (document.readyState == "complete") {
            debug("Document ready -- creating App");
            hideNoJS();
            var app = App();
            debug("Executing App");
            app.execute();
            //start();
        }
    };

})()    

